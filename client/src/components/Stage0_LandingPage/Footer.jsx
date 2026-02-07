
// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#004554] text-white px-[5%] pt-12 pb-6">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-8 mb-8">
        {/* About Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-xl font-bold">
            <div className="w-7 h-7 bg-gradient-to-br from-[#ff6b57] to-[#ffb347] rounded-full flex items-center justify-center text-sm">
              ⚡
            </div>
            PhantomClick
          </div>
          <div className="flex gap-4 mt-4">
            {['twitter', 'linkedin', 'github', 'instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white transition-all hover:bg-[#44a6b5] hover:-translate-y-1"
              >
                <i className={`fa-brands fa-${social}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg mb-4 text-[#44a6b5]">Quick Links</h3>
          <ul className="space-y-3">
            {['4-Stage Pipeline', 'Github Repository', 'API Documentations', 'Demo Video'].map((link) => (
              <li key={link}>
                <a href="#" className="text-white/80 text-sm transition-colors hover:text-[#44a6b5]">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg mb-4 text-[#44a6b5]">Resources</h3>
          <ul className="space-y-3">
            {[
              'Technical Documentation',
              'Setup Guide',
              { text: 'Cybercrime Portal', href: 'https://cybercrime.gov.in' },
              'Report a Scam'
            ].map((link, idx) => (
              <li key={idx}>
                <a
                  href={typeof link === 'object' ? link.href : '#'}
                  target={typeof link === 'object' ? '_blank' : undefined}
                  rel={typeof link === 'object' ? 'noopener noreferrer' : undefined}
                  className="text-white/80 text-sm transition-colors hover:text-[#44a6b5]"
                >
                  {typeof link === 'object' ? link.text : link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg mb-4 text-[#44a6b5]">Get in Touch</h3>
          <ul className="space-y-3">
            <li>
              <a href="mailto:support@phantomclick.com" className="text-white/80 text-sm transition-colors hover:text-[#44a6b5] flex items-center gap-2">
                <i className="fa-solid fa-envelope"></i> support@phantomclick.com
              </a>
            </li>
            <li>
              <a href="tel:+911234567890" className="text-white/80 text-sm transition-colors hover:text-[#44a6b5] flex items-center gap-2">
                <i className="fa-solid fa-phone"></i> +91 123 456 7890
              </a>
            </li>
            <li>
              <a href="#" className="text-white/80 text-sm transition-colors hover:text-[#44a6b5] flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i> Delhi, India
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 text-center text-white/60 text-sm">
        <p className="text-base text-white">Designed and Developed by Team Scriptix ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;