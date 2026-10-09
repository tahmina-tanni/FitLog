'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';
export function Navbar(){const path=usePathname();const {plan,saved}=useStore();const [open,setOpen]=useState(false);return <header className="site-header"><div className="nav-wrap"><Link href="/" className="brand" aria-label="FitLog home"><Image src="/assets/logo.png" width={28} height={28} alt=""/><span>FITLOG</span></Link><button className="mobile-menu" onClick={()=>setOpen(v=>!v)} aria-label={open?'Close navigation':'Open navigation'}>{open?<X/>:<Menu/>}</button><nav className={`main-nav ${open?'nav-open':''}`}><Link onClick={()=>setOpen(false)} className={path==='/'?'active':''} href="/#library">Workouts</Link><Link onClick={()=>setOpen(false)} className={path==='/my-plan'?'active':''} href="/my-plan">My Plan</Link></nav><div className="nav-counts"><Link href="/my-plan" className="count-pill plan-pill"><span>Plan</span><b>{plan.length}</b></Link><Link href="/my-plan?tab=saved" className="count-pill saved-pill"><span>Saved</span><b>{saved.length}</b></Link></div></div></header>}
