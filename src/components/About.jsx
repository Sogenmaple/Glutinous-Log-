export default function About() {
  const skills = [
    { name: '游戏设计', level: 90 },
    { name: '程序开发', level: 85 },
    { name: '美术设计', level: 75 },
    { name: '音效制作', level: 70 },
  ]

  return (
    <section className="about">
      <div className="about-content-wrapper">
      <div className="about-content">
        <div className="about-terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot terminal-dot--red"></span>
              <span className="terminal-dot terminal-dot--yellow"></span>
              <span className="terminal-dot terminal-dot--green"></span>
            </div>
            <span className="terminal-title">about_tangyuan.exe</span>
            <div className="terminal-dots-placeholder"></div>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="prompt">C:\TANGYUAN&gt;</span> cat profile.txt
            </div>
            <div className="terminal-output">
              <p>╔══════════════════════════════════╗</p>
              <p>║  名称: 汤圆                      ║</p>
              <p>║  身份: 独立游戏开发者             ║</p>
              <p>╚══════════════════════════════════╝</p>
              <br />
              <p>热衷于将创意转化为可交互的游戏体验。</p>
              <p>相信游戏是一种独特的艺术表达形式，</p>
              <p>每一部作品都是一次与玩家的对话。</p>
            </div>
            <div className="terminal-line">
              <span className="prompt">C:\TANGYUAN&gt;</span> run skills.dat
            </div>
            <div className="terminal-output">
              {skills.map(skill => (
                <div key={skill.name} className="skill-bar">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-track">
                    <div
                      className="skill-fill"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className="skill-percent">{skill.level}%</span>
                </div>
              ))}
            </div>
            <div className="terminal-line">
              <span className="prompt">C:\TANGYUAN&gt;</span>
              <span className="cursor">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}
