import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import lottielLight from 'lottie-web';
import { interval } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'running-cat';
   catPosition={
    x:0,
    y:0
  }
  catLottie!: HTMLElement;
  flipIt=false;
  mouse={
    x:0,
    y:0
  };
  width!: number;
  height!: number;
  timeOut= interval(100);
  subscription: any;
  ngOnInit(){
    this.catLottie=document.getElementById('lottie') as HTMLElement;
    lottielLight.loadAnimation({
        container:this.catLottie,
        renderer:'svg',
        loop:true,
        autoplay:true,
        path: 'https://assets1.lottiefiles.com/private_files/lf30_4gei4zbc.json'
    });
    this.width=this.catLottie.getBoundingClientRect().width;
    this.height=this.catLottie.getBoundingClientRect().height;
    this.updateAnimation();
    this.subscription=this.timeOut.subscribe(()=>{
      const x=this.catLottie.getBoundingClientRect().right-200;
      const y=this.catLottie.getBoundingClientRect().bottom-100;
      const distance=Math.sqrt(Math.pow((-this.catPosition.x+this.mouse.x),2)+Math.pow((+this.catPosition.y-this.mouse.y),2));
      console.log(this.catPosition,this.mouse);
      this.setAnimationSpeed(distance);
  });
  }



@HostListener('document: mousemove', ['$event'])
  handleMousemove(event: MouseEvent) {
    this.mouse.x=event.clientX;
    this.mouse.y=event.clientY;
  }

  lerp(a:number,b:number,t:number){
    return (1-t)*a+t*b;
  }

  setAnimationSpeed(distance: number){
    console.log(distance,"llll");
    if(distance>210){
      lottielLight.setSpeed(Math.round(distance/100));
    }else{
      lottielLight.setSpeed(1);
    }
  }

  
  updateAnimation=()=>{
    const catRect=this.catLottie.getBoundingClientRect();
    this.flipIt=catRect.x+this.width/2>this.mouse.x;
    this.catPosition.x=this.lerp(this.catPosition.x,this.mouse.x+this.width*(this.flipIt?0: -1),0.03);
    this.catPosition.y=this.lerp(this.catPosition.y,this.mouse.y,0.03);
    const angle=Math.atan((catRect.y+catRect.height/2-this.mouse.y)/(catRect.width/2-this.mouse.x));
    this.flipIt=catRect.x+this.width/2>this.mouse.x;
    this.catLottie.style.transform=('translate3d('+this.catPosition.x+'px,'+(this.catPosition.y-this.height/2)+'px,0)rotate('+angle+'rad) scaleX('+(this.flipIt?+'-1':'1')+')').toString();
    requestAnimationFrame(this.updateAnimation);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

