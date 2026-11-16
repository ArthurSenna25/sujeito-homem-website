// GSAP por npm (não CDN). As cenas portadas do protótipo leem gsap/ScrollTrigger/MotionPathPlugin como globais.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
Object.assign(window, { gsap, ScrollTrigger, MotionPathPlugin });
