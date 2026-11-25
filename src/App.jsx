import AnnouncementBar from './components/layout/AnnouncementBar.jsx'
import Footer from './components/layout/Footer.jsx'
import Header from './components/layout/Header.jsx'
import WhatsAppFab from './components/layout/WhatsAppFab.jsx'
import Hero from './components/sections/Hero.jsx'
import StatStrip from './components/sections/StatStrip.jsx'
import Categories from './components/sections/Categories.jsx'
import Products from './components/sections/Products.jsx'
import ServicesBand from './components/sections/ServicesBand.jsx'
import MeetCeo from './components/sections/MeetCeo.jsx'
import Reviews from './components/sections/Reviews.jsx'
import Certifications from './components/sections/Certifications.jsx'

function App() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <StatStrip />
        <Categories />
        <Products />
        <ServicesBand />
        <MeetCeo />
        <Reviews />
        <Certifications />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}

export default App
