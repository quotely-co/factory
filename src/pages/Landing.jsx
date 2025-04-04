import React from 'react'
import Header from "../sections/Header"
import Hero from "../sections/Hero"
import LogoTicker from "../sections/LogoTicker"
import ProductShowcase from "../sections/ProductShowcase"
import Pricing from "../sections/Pricing"
import Testimonials from "../sections/Testimonials"
import CallToAction from "../sections/CallToAction"
import Footer from "../sections/Footer"
const Landing = () => {
    return (
        <>
            <Header />
            <Hero />
            <LogoTicker />
            <ProductShowcase />
            <Pricing />
            <Testimonials />
            <CallToAction />
            <Footer />
        </>
    );
}

export default Landing
