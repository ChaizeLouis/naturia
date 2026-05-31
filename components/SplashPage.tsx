'use client'

interface Props {
  onLogin: () => void
  onRegister: () => void
}

export default function SplashPage({ onLogin, onRegister }: Props) {
  return (
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 20% 50%,rgba(63,182,139,0.1),transparent 60%),var(--bg)',display:'flex',flexDirection:'column'}}>
      {/* HEADER */}
      <div style={{padding:'1.4rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.7rem'}}>
          <div style={{width:38,height:38,background:'var(--adim)',border:'1px solid var(--accent)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>🌿</div>
          <div style={{fontFamily:'Fraunces, serif',fontSize:'1.35rem',color:'var(--accent)',fontWeight:600}}>Naturia</div>
        </div>
        <button onClick={onLogin} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'.55rem 1rem',color:'var(--text)',cursor:'pointer',fontFamily:'inherit',fontSize:'.875rem'}}>
          Se connecter
        </button>
      </div>

      {/* HERO */}
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem 1rem'}}>
        <div style={{background:'var(--adim)',border:'1px solid rgba(63,182,139,0.3)',borderRadius:20,padding:'.35rem .9rem',fontSize:'.78rem',color:'var(--accent)',fontWeight:500,marginBottom:'1.8rem',display:'inline-block'}}>
          ✨ Plateforme clinique nouvelle génération
        </div>

        <h1 style={{fontFamily:'Fraunces, serif',fontSize:'3rem',fontWeight:600,lineHeight:1.15,marginBottom:'1.1rem',maxWidth:680}}>
          La santé naturelle.<br />
          <span style={{color:'var(--accent)'}}>Enfin à la hauteur<br />de votre expertise.</span>
        </h1>

        <p style={{fontSize:'1rem',color:'var(--text2)',maxWidth:540,lineHeight:1.7,marginBottom:'2.2rem'}}>
          Logiciel professionnel tout-en-un pour naturopathes, nutritionnistes et thérapeutes. Gérez vos patients, protocoles et cabinet avec l&apos;IA à vos côtés.
        </p>

        <div style={{display:'flex',gap:'1rem',marginBottom:'2.5rem'}}>
          <button onClick={onRegister} style={{background:'var(--accent)',color:'#000',border:'none',borderRadius:10,padding:'.85rem 2rem',fontSize:'1rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
            Accéder à Naturia →
          </button>
          <button onClick={onLogin} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:10,padding:'.85rem 2rem',fontSize:'1rem',cursor:'pointer',color:'var(--text)',fontFamily:'inherit'}}>
            Déjà un compte
          </button>
        </div>

        {/* STATS */}
        <div style={{display:'flex',gap:'2.5rem',marginBottom:'2.5rem'}}>
          {[['315+','Suppléments PubMed'],['RGPD','Hébergement Europe'],['24h/24','ARIA & Nova IA'],['∞','Patients & consultations']].map(([v,l]) => (
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontFamily:'Fraunces, serif',fontSize:'1.7rem',fontWeight:600,color:'var(--accent)'}}>{v}</div>
              <div style={{fontSize:'.75rem',color:'var(--text2)'}}>{l}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.9rem',maxWidth:860,width:'100%'}}>
          {[['👥','Gestion patients','Dossiers, historique, consultations'],['💊','315 suppléments','Base PubMed avec niveau de preuve'],['🥗','Alimentation','Plans alimentaires & habitudes'],['🤖','ARIA & Nova','Assistantes IA 24h/24']].map(([icon,title,desc]) => (
            <div key={title} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:'1.1rem',textAlign:'left'}}>
              <div style={{fontSize:'1.4rem',marginBottom:'.5rem'}}>{icon}</div>
              <div style={{fontSize:'.875rem',fontWeight:600,marginBottom:'.25rem'}}>{title}</div>
              <div style={{fontSize:'.75rem',color:'var(--text2)',lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{padding:'1.2rem 2.5rem',borderTop:'1px solid var(--border2)',display:'flex',justifyContent:'space-between'}}>
        <div style={{fontSize:'.75rem',color:'var(--text3)'}}>© 2026 Naturia · RESURYA</div>
        <div style={{fontSize:'.75rem',color:'var(--text3)'}}>🔒 Données hébergées en Europe · RGPD</div>
      </div>
    </div>
  )
}
