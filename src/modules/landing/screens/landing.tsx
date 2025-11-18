import { ArrowRight, Check, Star, Users, TrendingUp, Shield, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const handleLoginClick = () => {
    window.location.href = '/login'
  }

  const handleSignupClick = () => {
    window.location.href = '/signup'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#5A6ACF] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">AutoFinance</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleLoginClick}>
                Entrar
              </Button>
              <Button 
                className="bg-[#5A6ACF] hover:bg-[#4A5ABF] text-white"
                onClick={handleSignupClick}
              >
                Cadastre-se
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
              Transforme sua 
              <span className="bg-gradient-to-r from-[#5A6ACF] to-[#707FDD] bg-clip-text text-transparent">
                {" "}Gestão Automotiva
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              A plataforma completa para gerenciar clientes, orçamentos, serviços e agendamentos 
              da sua oficina ou concessionária. Automatize processos e aumente sua produtividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-[#5A6ACF] hover:bg-[#4A5ABF] text-white text-lg px-8 py-3"
                onClick={handleSignupClick}
              >
                Cadastre-se
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-3"
                onClick={handleLoginClick}
              >
                Realizar Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos que Impulsionam seu Negócio
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para gerenciar sua empresa automotiva de forma eficiente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#5A6ACF]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Clientes</h3>
              <p className="text-gray-600">
                Cadastre e organize informações completas dos seus clientes. Histórico de serviços, 
                contatos e dados dos veículos em um só lugar.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#707FDD]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Orçamentos Inteligentes</h3>
              <p className="text-gray-600">
                Crie orçamentos profissionais rapidamente. Controle de aprovações, 
                margens de lucro e histórico completo de propostas.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Agendamentos</h3>
              <p className="text-gray-600">
                Organize sua agenda de serviços. Evite conflitos, gerencie recursos 
                e mantenha seus clientes sempre informados.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automação</h3>
              <p className="text-gray-600">
                Automatize tarefas repetitivas. Lembretes automáticos, 
                follow-ups e notificações para você e seus clientes.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Segurança</h3>
              <p className="text-gray-600">
                Seus dados protegidos com criptografia de ponta. 
                Backups automáticos e acesso controlado por usuário.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#5A6ACF]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relatórios</h3>
              <p className="text-gray-600">
                Dashboards intuitivos com métricas importantes. 
                Acompanhe performance, receita e crescimento do negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Empresas que transformaram seus negócios com a AutoFinance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "A AutoFinance revolucionou nossa oficina. Conseguimos organizar melhor 
                os agendamentos e aumentamos nossa receita em 30% no primeiro trimestre."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MR</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Marcos Roberto</p>
                  <p className="text-gray-600 text-sm">Oficina Silva & Cia</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Interface intuitiva e recursos completos. Nossa equipe se adaptou 
                rapidamente e agora somos muito mais produtivos."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">AS</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Ana Santos</p>
                  <p className="text-gray-600 text-sm">Auto Center Premium</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "O suporte é excepcional e o sistema nunca falha. 
                Recomendo para qualquer empresa do setor automotivo."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">CF</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Carlos Ferreira</p>
                  <p className="text-gray-600 text-sm">Concessionária Norte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que se Adaptam ao seu Negócio
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o tamanho da sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Básico</h3>
              <p className="text-gray-600 mb-4">Ideal para pequenas oficinas</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">R$ 89</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Até 100 clientes</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Gestão de orçamentos</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Agendamentos básicos</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Suporte por email</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={handleSignupClick}>
                Cadastre-se
              </Button>
            </div>

            {/* Plano Profissional */}
            <div className="border-2 border-[#5A6ACF] rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#5A6ACF] text-white px-3 py-1 rounded-full text-sm">
                  Mais Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profissional</h3>
              <p className="text-gray-600 mb-4">Para empresas em crescimento</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">R$ 189</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Clientes ilimitados</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Todos os recursos do Básico</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Relatórios avançados</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Automações</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Suporte prioritário</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-[#5A6ACF] hover:bg-[#4A5ABF] text-white"
                onClick={handleSignupClick}
              >
                Cadastre-se - Teste Grátis
              </Button>
            </div>

            {/* Plano Enterprise */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">Para grandes empresas</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">R$ 389</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Todos os recursos</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Múltiplas filiais</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">API personalizada</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Treinamento dedicado</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Suporte 24/7</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" onClick={handleSignupClick}>
                Falar com Vendas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#5A6ACF] to-[#707FDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para Transformar seu Negócio?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já escolheram a AutoFinance 
            para gerenciar seus negócios de forma inteligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-[#5A6ACF] hover:bg-gray-50 text-lg px-8 py-3"
              onClick={handleSignupClick}
            >
              Cadastre-se
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 

              className="border-white text-white hover:bg-white text-lg px-8 py-3"
              onClick={handleLoginClick}
            >
              Realizar Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#5A6ACF] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="ml-2 text-xl font-bold">AutoFinance</span>
              </div>
              <p className="text-gray-400">
                A plataforma completa para gestão do seu negócio automotivo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Recursos</li>
                <li>Preços</li>
                <li>Segurança</li>
                <li>Atualizações</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre nós</li>
                <li>Carreiras</li>
                <li>Blog</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Status</li>
                <li>Termos de Uso</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 AutoFinance. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
