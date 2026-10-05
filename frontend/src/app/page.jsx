import Link from 'next/link';
import { ArrowRight, Utensils, Leaf, HeartHandshake, CheckCircle2, Store, Wallet, Recycle } from 'lucide-react';
import { homePage, getHomeSection } from './home-page-data';

export const metadata = {
  title: 'ReMeal — Makan enak, selamatkan makanan',
  description: homePage.purpose,
};

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#211f1c] bg-[#fff9ef] py-4 px-6 sm:px-12 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="bg-[#ffc72c] border-2 border-[#211f1c] text-[#211f1c] p-2 rounded-xl shadow-[2px_2px_0px_0px_#211f1c] rotate-3 hover:rotate-0 transition-transform">
          <Utensils size={24} strokeWidth={2.5} />
        </div>
        <span className="text-3xl font-black text-[#211f1c] tracking-tight">{homePage.footer.brand}</span>
      </Link>
      <div className="flex gap-2 md:hidden">
        <Link href={homePage.navigation[4].href} id="nav-login-mobile" className="px-4 py-2 rounded-full border-2 border-[#211f1c] text-sm font-bold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c]">
          {homePage.navigation[4].label}
        </Link>
        <Link href={homePage.navigation[5].href} id="nav-register-mobile" className="px-4 py-2 rounded-full border-2 border-[#211f1c] bg-[#ffc72c] text-sm font-bold text-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c]">
          {homePage.navigation[5].label}
        </Link>
      </div>
      <nav className="hidden md:flex gap-8 items-center text-sm font-bold text-[#211f1c]">
        {homePage.navigation.slice(0, 4).map((item) => (
          <Link key={item.label} href={item.href} className="hover:text-[#ffc72c] hover:underline underline-offset-4 decoration-2 transition-all">
            {item.label}
          </Link>
        ))}
        <div className="flex gap-3 ml-4">
          <Link 
            href={homePage.navigation[4].href} 
            id="nav-login"
            className="px-5 py-2.5 rounded-full border-2 border-[#211f1c] font-bold hover:bg-[#ffe4a9] shadow-[2px_2px_0px_0px_#211f1c] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#211f1c] transition-all"
          >
            {homePage.navigation[4].label}
          </Link>
          <Link 
            href={homePage.navigation[5].href} 
            id="nav-register"
            className="px-5 py-2.5 rounded-full border-2 border-[#211f1c] font-bold bg-[#ffc72c] shadow-[2px_2px_0px_0px_#211f1c] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#211f1c] transition-all"
          >
            {homePage.navigation[5].label}
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  const data = getHomeSection('hero');
  return (
    <section className="relative w-full px-6 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12 bg-[#fffdf8] border-b-2 border-[#211f1c] overflow-hidden">
      <div className="absolute top-10 right-10 md:top-20 md:right-32 text-[#dcebd3] -z-10 rotate-12">
        <Leaf size={240} strokeWidth={0.5} />
      </div>
      
      <div className="max-w-2xl z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f7d4c9] border-2 border-[#211f1c] shadow-[2px_2px_0px_0px_#211f1c] font-bold text-[#211f1c] text-sm mb-8 -rotate-2">
          <span>{homePage.purpose.split(' ')[0]} {homePage.purpose.split(' ')[1]}</span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#211f1c] tracking-tight leading-[1.05] mb-8">
          {data.title.split('.')[0]}<span className="text-[#ffc72c]">.</span> <br />
          {data.title.split('.')[1]}<span className="text-[#ffc72c]">.</span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-medium text-[#211f1c] max-w-xl mb-10 leading-relaxed border-l-4 border-[#ffc72c] pl-6">
          {data.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <Link 
            href={data.actions[0].href} 
            className="group flex items-center justify-center gap-3 bg-[#ffc72c] border-2 border-[#211f1c] text-[#211f1c] px-8 py-4 rounded-full font-black text-lg shadow-[4px_4px_0px_0px_#211f1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#211f1c] transition-all"
          >
            {data.actions[0].label}
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={data.actions[1].href} 
            className="flex items-center justify-center bg-[#fff9ef] border-2 border-[#211f1c] text-[#211f1c] px-8 py-4 rounded-full font-bold text-lg shadow-[4px_4px_0px_0px_#211f1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#211f1c] transition-all"
          >
            {data.actions[1].label}
          </Link>
        </div>
      </div>
      
      <div className="flex-1 w-full flex justify-center z-10 mt-10 md:mt-0">
        <div className="relative w-full max-w-md aspect-square bg-[#ffe4a9] border-4 border-[#211f1c] rounded-[2rem] shadow-[8px_8px_0px_0px_#211f1c] overflow-hidden -rotate-2 hover:rotate-0 transition-transform duration-500 flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <p className="text-2xl font-black text-[#211f1c] text-center border-4 border-[#211f1c] bg-[#fff9ef] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#211f1c] rotate-3">
            {data.visual}
          </p>
        </div>
      </div>
    </section>
  );
}

function ImpactMetrics() {
  const data = getHomeSection('dampak-ringkas');
  return (
    <section id="dampak" className="w-full bg-[#dcebd3] border-b-2 border-[#211f1c] py-16 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-[#211f1c] text-center mb-12">{data.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.metrics.map((metric, i) => (
            <div key={i} className="bg-[#fff9ef] border-2 border-[#211f1c] rounded-2xl p-6 text-center shadow-[4px_4px_0px_0px_#211f1c] hover:-translate-y-1 transition-transform">
              <p className="text-4xl md:text-5xl font-black text-[#ffc72c] mb-2">{metric.value ?? '0+'}</p>
              <p className="text-sm font-bold text-[#211f1c]">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const data = getHomeSection('tentang');
  return (
    <section id="tentang" className="w-full bg-[#fff9ef] border-b-2 border-[#211f1c] py-24 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-5xl md:text-6xl font-black text-[#211f1c] leading-tight">
            {data.title}
          </h2>
          <p className="text-xl font-medium text-[#716e68] max-w-xl">
            {data.description}
          </p>
        </div>
        <div className="flex-1 grid gap-6 w-full">
          {data.benefits.map((benefit, i) => (
            <div key={i} className="flex gap-6 bg-[#fffdf8] border-2 border-[#211f1c] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#211f1c]">
              <div className="bg-[#ffc72c] border-2 border-[#211f1c] h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#211f1c]">
                <CheckCircle2 size={24} className="text-[#211f1c]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#211f1c] mb-2">{benefit.title}</h3>
                <p className="text-[#716e68] font-medium">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const data = getHomeSection('cara-kerja');
  return (
    <section id="cara-kerja" className="w-full bg-[#f7d4c9] border-b-2 border-[#211f1c] py-24 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black text-[#211f1c] text-center mb-16">{data.title}</h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 border-t-4 border-dashed border-[#211f1c] z-0"></div>
          {data.steps.map((step, i) => (
            <div key={i} className="relative z-10 bg-[#fff9ef] border-2 border-[#211f1c] rounded-[2rem] p-8 text-center shadow-[6px_6px_0px_0px_#211f1c] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-[#ffc72c] border-2 border-[#211f1c] rounded-full flex items-center justify-center text-3xl font-black text-[#211f1c] shadow-[4px_4px_0px_0px_#211f1c] mb-6 -mt-14">
                {step.number}
              </div>
              <h3 className="text-2xl font-black text-[#211f1c] mb-4">{step.title}</h3>
              <p className="text-[#716e68] font-medium">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  const data = getHomeSection('cta');
  return (
    <section className="w-full bg-[#ffc72c] border-b-2 border-[#211f1c] py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <HeartHandshake size={64} className="mx-auto mb-8 text-[#211f1c]" strokeWidth={2.5} />
        <h2 className="text-5xl md:text-7xl font-black text-[#211f1c] mb-6 leading-tight">
          {data.title}
        </h2>
        <p className="text-2xl font-medium text-[#211f1c] mb-12">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            href={data.actions[0].href} 
            className="bg-[#211f1c] text-[#fff9ef] border-2 border-[#211f1c] px-10 py-5 rounded-full font-black text-xl hover:bg-[#fff9ef] hover:text-[#211f1c] transition-colors shadow-[6px_6px_0px_0px_#fff9ef] hover:shadow-[6px_6px_0px_0px_#211f1c]"
          >
            {data.actions[0].label}
          </Link>
          <Link 
            href={data.actions[1].href} 
            className="bg-[#fffdf8] text-[#211f1c] border-2 border-[#211f1c] px-10 py-5 rounded-full font-black text-xl hover:bg-[#dcebd3] transition-colors shadow-[6px_6px_0px_0px_#211f1c]"
          >
            {data.actions[1].label}
          </Link>
        </div>
      </div>
    </section>
  );
}

const whyIcons = [Wallet, Recycle, Store];

function WhyReMeal() {
  const data = getHomeSection('kenapa-remeal');
  return (
    <section id="kenapa-remeal" className="w-full bg-[#fffdf8] border-b-2 border-[#211f1c] py-24 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-5xl md:text-6xl font-black text-[#211f1c] leading-tight">{data.title}</h2>
          <p className="mt-5 text-xl font-medium text-[#716e68]">{data.description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {data.benefits.map((benefit, i) => {
            const Icon = whyIcons[i % whyIcons.length];
            const bg = ['#ffe4a9', '#dcebd3', '#f7d4c9'][i % 3];
            return (
              <div key={benefit.title} className="rounded-[2rem] border-2 border-[#211f1c] p-8 shadow-[6px_6px_0px_0px_#211f1c] hover:-translate-y-1 transition-transform" style={{ backgroundColor: bg }}>
                <div className="w-14 h-14 rounded-2xl border-2 border-[#211f1c] bg-[#fff9ef] flex items-center justify-center shadow-[3px_3px_0px_0px_#211f1c] mb-6">
                  <Icon size={26} className="text-[#211f1c]" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-[#211f1c] mb-3">{benefit.title}</h3>
                <p className="text-[#211f1c]/75 font-medium">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { footer } = homePage;
  return (
    <footer className="w-full bg-[#211f1c] text-[#fff9ef]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1.3fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="bg-[#ffc72c] border-2 border-[#fff9ef] text-[#211f1c] p-2 rounded-xl rotate-3">
                <Utensils size={22} strokeWidth={2.5} />
              </span>
              <span className="text-3xl font-black tracking-tight">{footer.brand}</span>
            </Link>
            <p className="mt-5 max-w-xs text-[#fff9ef]/70 font-medium leading-relaxed">{footer.tagline}</p>
          </div>

          {footer.groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#ffc72c]">{group.title}</h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="font-bold text-[#fff9ef]/80 hover:text-[#ffc72c] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="rounded-[1.75rem] border-2 border-[#fff9ef] bg-[#ffc72c] p-7 text-[#211f1c] shadow-[6px_6px_0px_0px_#fff9ef] -rotate-1 hover:rotate-0 transition-transform">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl border-2 border-[#211f1c] bg-[#fff9ef] flex items-center justify-center">
                <Store size={22} strokeWidth={2.5} />
              </span>
              <h3 className="text-xl font-black">{footer.seller.title}</h3>
            </div>
            <p className="mt-4 text-sm font-semibold leading-relaxed">{footer.seller.description}</p>
            <Link
              href={footer.seller.action.href}
              id="footer-seller-register"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#211f1c] bg-[#211f1c] px-6 py-3 font-black text-[#fff9ef] hover:bg-[#fff9ef] hover:text-[#211f1c] transition-colors"
            >
              {footer.seller.action.label}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#fff9ef]/20 pt-6 text-sm font-semibold text-[#fff9ef]/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p className="flex items-center gap-2">
            <Leaf size={16} className="text-[#dcebd3]" /> Dibuat untuk mengurangi food waste
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff9ef] flex flex-col font-sans selection:bg-[#ffc72c] selection:text-[#211f1c]">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <HeroSection />
        <ImpactMetrics />
        <AboutSection />
        <HowItWorks />
        <WhyReMeal />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}