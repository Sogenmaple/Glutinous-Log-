export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-divider">
          {'═'.repeat(40)}
        </div>
        <div className="footer-info">
          <span className="footer-logo">[汤圆]</span>
          <span className="footer-separator">///</span>
          <span className="footer-text">GAME PORTFOLIO SYSTEM</span>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">[GITHUB]</a>
          <a href="#" className="footer-link">[ITCH.IO]</a>
          <a href="#" className="footer-link">[EMAIL]</a>
        </div>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} 汤圆 // ALL RIGHTS RESERVED
        </div>
        <div className="footer-decoration">
          ▂▃▅▆▇ END OF TRANSMISSION ▇▆▅▃▂
        </div>
      </div>
    </footer>
  )
}
