
import Image from 'next/image'

import Logo from './assets/logo.png'

export default function Home() {
  return (
    <div className="h-screen bg-hero-background bg-no-repeat bg-[position:700px_bottom]">
      <div className="w-full h-full max-w-[1100px] mx-auto px-8 flex flex-col items-start">
        <header className="mt-12">
          <Image src={Logo} alt="Freya" />
        </header>

        <main className="flex flex-col justify-center flex-1 max-w-[500px]">
          <h1 className="text-[54px] text-[#322153] leading-[60px]">Seu marketplace
          de coleta de resíduos.</h1>
          <p className="text-[22px] mt-6 leading-[38px]">Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          <a className="w-full max-w-[360px] h-24 bg-[#34CB79] rounded-lg no-underline	flex items-center overflow-hidden mt-10 justify-center text-white font-bold text-xl hover:bg-[#2FB86E]" href="/cadastro">
          Cadastre um ponto de coleta
          </a>
        </main>
      </div>
    </div>
  );
}
