'use client'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
const COLORS = ['#22c55e','#2563eb','#f59e0b','#ef4444','#a855f7','#06b6d4']
const EMOJIS = ['✨','🎉','🎊','⭐','💫','🎈']
export default function ConfettiBurst({ onDone }: { onDone?: ()=>void }) {
  const pieces = Array.from({ length: 28 }).map((_, i) => ({
    id: i, x: (Math.random()*2-1)*160, y: (Math.random()*-1-0.3)*140, r: (Math.random()*2-1)*40, d: 500+Math.random()*600,
    c: COLORS[i%COLORS.length], e: EMOJIS[i%EMOJIS.length],
  }))
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] grid place-items-center">
      {pieces.map(p => (
        <Fragment key={p.id}>
          <motion.div initial={{opacity:0,x:0,y:0,rotate:0}} animate={{opacity:1,x:p.x,y:p.y,rotate:p.r}} transition={{duration:p.d/1000,ease:'easeOut'}} style={{color:p.c,fontSize:22,lineHeight:1}}>
            {p.e}
          </motion.div>
        </Fragment>
      ))}
      <motion.div initial={{opacity:1}} animate={{opacity:0}} transition={{delay:1,duration:0.4}} onAnimationComplete={onDone}/>
    </div>
  )
}
