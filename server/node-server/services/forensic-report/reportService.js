const { GoogleGenerativeAI } = require('@google/generative-ai');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReportService {
    async generateNarrative(data) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const today = new Date().toLocaleDateString('en-IN', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            const prompt = `
                IMPORTANT: Today's date is ${today}. Use this date in the report. 
                Write a professional forensic cybercrime report in English based on this data:
                Stage 1: ${JSON.stringify(data.stage1)}
                Stage 2: ${JSON.stringify(data.stage2)}
                Stage 3: ${JSON.stringify(data.stage3)}
                
                Keep the tone formal and provide a detailed analysis.
            `;

            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (err) {
            console.error("Gemini SDK Error:", err.message);
            return "AI forensic narrative generation failed.";
        }
    }

    async generatePDF(data, narrative, caseId) {

        return new Promise((resolve, reject) => {

            const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

            const fileName = `Forensic_Report_${caseId}.pdf`;

            const filePath = path.join(__dirname, '../..', 'reports', fileName);



            if (!fs.existsSync(path.dirname(filePath))) {

                fs.mkdirSync(path.dirname(filePath), { recursive: true });

            }



            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);



            // --- Header ---

            doc.font('Helvetica-Bold').fontSize(18).text('THREAT INTELLIGENCE & FRAUD ANALYSIS REPORT');

            doc.fontSize(10).font('Helvetica').text('Issued by: Phantom-Click Intelligence Unit');

            doc.moveTo(50, 85).lineTo(550, 85).strokeColor('#000000').lineWidth(1).stroke();

            doc.moveDown(2);



            // --- Metadata ---

            doc.font('Helvetica-Bold').fontSize(11).text(`CASE ID: ${caseId}`);

            doc.font('Helvetica').fontSize(10).text(`Date of Issue: ${new Date().toLocaleString('en-IN')}`);

            doc.text(`Classification: RESTRICTED / FOR OFFICIAL USE ONLY`);

            doc.moveDown(2);



            // --- Refined Section Helper (Same Line Fix) ---

            const renderCleanSection = (title, contentObj) => {

                doc.font('Helvetica-Bold').fontSize(12).fillColor('#333333').text(title.toUpperCase());

                doc.moveTo(50, doc.y + 2).lineTo(250, doc.y + 2).stroke();

                doc.moveDown(1);

                doc.fillColor('#000000');



                const blacklist = ['pages', 'screenshots', 'actions', 'time', 'logs', 'history', 'raw'];



                for (let [key, value] of Object.entries(contentObj)) {

                    // Skip empty/blacklisted

                    if (!value || blacklist.includes(key.toLowerCase())) continue;

                    if (Array.isArray(value) && value.length === 0) continue;



                    const cleanKey = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim().toUpperCase();

                    let displayValue = "";



                    if (Array.isArray(value)) {

                        if (typeof value[0] === 'object') continue;

                        displayValue = value.join(', ');

                    } else if (typeof value === 'object') {

                        displayValue = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ');

                    } else {

                        displayValue = String(value);

                    }



                    // --- Same Line Render ---

                    doc.font('Helvetica-Bold').fontSize(10).text(`${cleanKey}: `, { continued: true });

                    doc.font('Helvetica').fontSize(10).text(displayValue, { width: 400, align: 'left' });

                    doc.moveDown(0.3);

                }

                doc.moveDown(1.5);

            };



            // --- Section 1: SMS Evidence ---

            if (data.stage1) {

                renderCleanSection('Section 1: Evidence Collected', data.stage1);

            }



            // --- Section 2: Threat Score ---

            if (data.stage2) {

                renderCleanSection('Section 2: Risk Assessment', data.stage2);

            }



            // --- Section 3: Sandbox (Relevant Info Only) ---

            if (data.stage3) {

                // Hum specifically relevant fields extract kar rahe hain

                const sandboxData = {

                    "Analysis Verdict": data.stage3.summary || "Malicious behavior detected",

                    "Data Targeted": data.stage3.stolenDataTypes, // Ab ye "Username, Password" dikhayega

                    "Exfiltration Server": data.stage3.exfiltrationServer || "Hidden/Encrypted",

                    "Security Flags": data.stage3.suspiciousBehaviors,

                    "Redirect Path": data.stage3.redirectChain ? data.stage3.redirectChain.join(' -> ') : null

                };

                renderCleanSection('Section 3: Virtual Safety Check', sandboxData);

            }



            // --- Section 4: AI Narrative ---

            if (doc.y > 600) doc.addPage();

            doc.font('Helvetica-Bold').fontSize(12).text('SECTION 4: AI GENERATED NARRATIVE');

            doc.moveTo(50, doc.y + 2).lineTo(350, doc.y + 2).stroke();

            doc.moveDown(1);

            doc.font('Helvetica').fontSize(10).text(narrative, { align: 'justify', lineGap: 3 });



            // Footer

            const range = doc.bufferedPageRange();

            for (let i = 0; i < range.count; i++) {

                doc.switchToPage(i);

                // Compute footer position using the page's dimensions and margins to avoid overflowing
                const page = doc.page;
                const footerY = page.height - page.margins.bottom - 20; // 20pt above bottom margin
                const footerWidth = page.width - page.margins.left - page.margins.right;

                doc.fontSize(8).fillColor('#999999').text(
                    `PhantomClick Forensic Unit | Case: ${caseId} | Page ${i + 1} of ${range.count}`,
                    page.margins.left,
                    footerY,
                    { width: footerWidth, align: 'center' }
                );

            }



            doc.end();

            stream.on('finish', () => resolve(fileName));

            stream.on('error', reject);

        });

    }
}

module.exports = new ReportService();