import { BookOpen } from 'react-feather'

const Navbar = () => {
  return (
    <header className="app-navbar">
      <a className="brand-lockup" href="/" aria-label="Student Ledger home">
        <span className="brand-symbol"><BookOpen size={17} /></span>
        <span className="brand-name">student<span>ledger</span></span>
      </a>
      <div className="workspace-label"><span className="workspace-dot" /> Personal workspace</div>
    </header>
  )
}

export default Navbar

// Priyam