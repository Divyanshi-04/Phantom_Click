const Navigation = () => {
  return (
    <nav className="flex justify-between items-center px-[5%] py-6 bg-transparent z-[100] ">
      <div className="flex items-center gap-2 text-2xl font-bold text-white">
        <div className="w-8 h-8 bg-gradient-to-br from-[#ff6b57] to-[#ffb347] rounded-full flex items-center justify-center">
          ⚡
        </div>
        PhantomClick
      </div>
      <ul className="hidden md:flex gap-10 list-none">
        {['Home', 'Features', 'Team', 'Contact'].map((item, idx) => (
          <li key={idx}>
            <a
              href={`#${item.toLowerCase()}`}
              className={`text-white/85 no-underline text-[1 rem] transition-colors duration-300 border-b-2 border-transparent pb-1 hover:text-white hover:border-[#44a6b5] ${idx === 0 ? 'border-[#44a6b5] text-white' : ''}`}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
      <div className="hidden md:flex gap-4">
        <a
          href="#"
          className="px-6 py-3 rounded-[25px] bg-[#44a6b5] text-white font-semibold text-[0.9rem] transition-all duration-300 hover:bg-[#ff5542] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,107,87,0.4)]"
        >
          Report Scam
        </a>
      </div>
    </nav>
  );
};
export default Navigation;
