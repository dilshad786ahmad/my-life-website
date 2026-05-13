import React from 'react'
import Home from './Hero'
import ExcellenceSection from './Excellenace'
import About from './About'
import Team from "./our_team"
import WhatIOffer from './Offer'
import SpecializedSolutions from './Contact'
import LazySection from '../components/LazySection'

const Container = () => {
  return (
   <>
   <Home/>
   {/* <ExcellenceSection/> */}
   <LazySection minHeight="80vh">
     <About/>
   </LazySection>
   {/* <Team/> */}
   <LazySection minHeight="80vh">
     <WhatIOffer/>
   </LazySection>
   <LazySection minHeight="80vh">
     <SpecializedSolutions/>
   </LazySection>
   </>
  )
}

export default Container
