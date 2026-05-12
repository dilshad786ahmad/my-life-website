import React from 'react'
import Home from './Hero'
import ExcellenceSection from './Excellenace'
import About from './About'
import Team from "./our_team"
import WhatIOffer from './Offer'
import SpecializedSolutions from './Contact'

const Container = () => {
  return (
   <>
   <Home/>
   {/* <ExcellenceSection/> */}
   <About/>
   {/* <Team/> */}
   <WhatIOffer/>
   <SpecializedSolutions/>
   </>
  )
}

export default Container
