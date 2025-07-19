"use client"
import React from 'react'
import { Carousel, CarouselItem, CarouselContent} from './ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import testimonial from "@/data/testimonial"
import { Card, CardContent } from './ui/card'

const TestimonialCarousel = () => {
  return (
    <div className="relative mt-24 flex flex-col items-center">
      {/* Heart Background Image */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-20 w-full h-[400px] flex justify-center pointer-events-none select-none">
        <img 
          src="/h2.png" 
          alt="Heart background" 
          className="opacity-30"
          style={{ height: '560px', width: '560px', objectFit: 'cover', marginTop: '-65px', marginLeft: '-5px' }}
        />
      </div>
      {/* Organic Splash Gradient Background */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 w-full h-[400px] pointer-events-none select-none">
        <div className="absolute left-[30%] top-[10%] w-[400px] h-[220px] bg-orange-200 opacity-40 rounded-full blur-3xl rotate-[-18deg]" style={{boxShadow: '0 0 120px 40px #fdba74'}} />
        <div className="absolute right-[20%] top-[20%] w-[300px] h-[180px] bg-pink-200 opacity-30 rounded-full blur-2xl rotate-[12deg]" style={{boxShadow: '0 0 80px 20px #f472b6'}} />
        <div className="absolute left-[55%] top-[35%] w-[180px] h-[100px] bg-orange-300 opacity-30 rounded-full blur-2xl rotate-[8deg]" style={{boxShadow: '0 0 60px 10px #fdba74'}} />
      </div>
      
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <span className="px-4 py-1 mb-2 rounded-full bg-orange-100/60 text-orange-700 text-sm font-semibold shadow-sm">Wall of Love</span>
        <h2 className="text-4xl md:text-5xl font-bold text-center text-orange-900 mb-3 tracking-tight">Loved by Thinkers</h2>
        <p className="text-center text-orange-800/80 mb-10 text-lg">Here's what people are saying about us</p>
      </div>
        <Carousel
            className="w-full"
            plugins={[
                Autoplay({
                delay: 2000,
                }),
            ]}
            opts={{
                loop: true, 
              }}            
            >
            <CarouselContent>
                {testimonial.map((testimonial: any, index: any) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white/80 backdrop-blur-sm h-full flex flex-col justify-center min-h-[260px]">
                        <CardContent className="p-6 flex flex-col h-full justify-center">
                        <blockquote className="space-y-4 flex flex-col h-full justify-center">
                            <p className="text-orange-700 italic">
                            &quot;{testimonial.text}&quot;
                            </p>
                            <footer>
                            <div className="font-semibold text-orange-900">
                                {testimonial.author}
                            </div>
                            <div className="text-sm text-orange-600">
                                {testimonial.role}
                            </div>
                            </footer>
                        </blockquote>
                        </CardContent>
                    </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel> 
    </div>
  )
}

export default TestimonialCarousel