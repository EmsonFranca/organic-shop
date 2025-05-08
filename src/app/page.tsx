import Link from "next/link"
import { ArrowRight, Leaf } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Verde Vivo</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-white border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Produtos orgânicos frescos direto para sua casa
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Conectamos produtores orgânicos locais com consumidores que valorizam alimentos saudáveis e sustentáveis.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="px-6 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                Ver produtos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-md bg-white border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
              >
                Saiba mais
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/placeholder.svg"
              width={500} // Specify the width
              height={400} // Specify the height
              alt="Produtos orgânicos"
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Como funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-800 font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-green-800">Cadastre-se</h4>
              <p className="text-gray-600">
                Crie sua conta como cliente para fazer pedidos ou como gerente para administrar produtos e vendas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-800 font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-green-800">Escolha produtos</h4>
              <p className="text-gray-600">
                Navegue pelo catálogo de produtos orgânicos frescos e adicione-os ao seu carrinho.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-800 font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-green-800">Receba em casa</h4>
              <p className="text-gray-600">
                Finalize seu pedido e receba produtos orgânicos frescos diretamente na sua porta.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Produtos em destaque</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src={`/placeholder.svg`}
                  width={500} // Specify the width
                  height={400} // Specify the height
                  alt={`Produto ${item}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-1 text-green-800">Produto Orgânico {item}</h4>
                  <p className="text-gray-600 text-sm mb-2">Categoria</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-bold">R$ {(15 + item * 2).toFixed(2)}</span>
                    <button className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5" /> Verde Vivo
              </h4>
              <p className="text-green-100">Conectando produtores e consumidores de produtos orgânicos desde 2009.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Links Úteis</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-green-100 hover:text-white">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-green-100 hover:text-white">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-green-100 hover:text-white">
                    Termos de uso
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contato</h4>
              <p className="text-green-100 mb-2">verdevivo@gmail.com</p>
              <p className="text-green-100">+55 (84) 99999-9999</p>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-4 text-center text-green-100">
            &copy; {new Date().getFullYear()} Verde Vivo. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
