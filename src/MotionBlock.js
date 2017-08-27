import React, { Component } from 'react';
import './App.css';

let scroll;
let startX = 0;
let startY = 0;

let origX = 0;
let origY = 0;
let deltaX = 0;
let deltaY = 0;

// let finalPosLeft = 0;
// let finalPosTop = 0;

class MotionBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    // revert the touch event to mousedown event for mobile
    let mouseEventTypes = {
      touchstart: "mousedown",
      touchmove: "mousemove",
      touchend: "mouseup"
    };
    for (let originalType in mouseEventTypes) {
      document.addEventListener(originalType, function (originalEvent) {
        let event = document.createEvent("MouseEvents");
        let touch = originalEvent.changedTouches[0];
        event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true, window, 0, touch.screenX, touch.screenY, touch.clientX, touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey, touch.metaKey, 0, null);
        originalEvent.target.dispatchEvent(event);
      });
    }
  }

  getScrollOffsets = (w) => {
    w = w || window;
    if(w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
    var d = w.document;
    if(document.compatMode === "CSS1Compat")
      return {x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop};

    return {x: d.body.scrollLeft, y: d.body.scrollTop};
  }

  moveHandler = (e) => {
    if(!e) e = window.event;
    scroll = this.getScrollOffsets();
    this.refs.thisMount.style.left = (e.clientX + scroll.x - deltaX)+"px";
    this.refs.thisMount.style.top = (e.clientY + scroll.y - deltaY)+"px";
  }

  upHandler = (e) => {
    if (!e) e = window.event;
    if (document.removeEventListener) {
      document.removeEventListener("mouseup", this.upHandler, true);
      document.removeEventListener("mousemove", this.moveHandler, true);
    } else if (document.detachEvnet) {
      this.refs.thisMount.detachEvent("onlosecapture", this.upHandler);
      this.refs.thisMount.detachEvent("onmouseup", this.upHandler);
      this.refs.thisMount.detachEvent("onmousemove", this.moveHandler);
    }

    if(e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }

  onDrag = (e) => {
    document.ontouchmove = function (e) {
      e.preventDefault();
    };

    scroll = this.getScrollOffsets();
    startX = e.clientX + scroll.x;
    startY = e.clientY + scroll.y;

    origX = this.refs.thisMount.offsetLeft;
    origY = this.refs.thisMount.offsetTop;
    deltaX = startX - origX;
    deltaY = startY - origY;

    document.addEventListener("mousemove", this.moveHandler, true);
    document.addEventListener("mouseup", this.upHandler, true);    

    if (document.addEventListener) {
      document.addEventListener("mousemove", this.moveHandler, true);
      document.addEventListener("mouseup", this.upHandler, true);
    } else if (document.attachEvent) {
      this.refs.thisMount.setCapture();
      this.refs.thisMount.attachEvent("onmousemove", this.moveHandler);
      this.refs.thisMount.attachEvent("onmouseup", this.upHandler);
      this.refs.thisMount.attachEvent("onlosecapture", this.upHandler);
    }

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }

  render() {
    return (
      <div className='container'>
        <div className='App-header App'>
          <span>Drag Playground, hello React ! :D</span>
        </div>
        <div ref='thisMount' onMouseDown={this.onDrag} style={{ position: 'absolute'}}>
          <div style={{height: 50, cursor: 'move', backgroundColor: '#d1f4ff', textAlign: 'center', lineHeight: '50px'}}>
            <span>Drag here !</span>
          </div>
          <div ref='embed' className='embed-responsive embed-responsive-16by9'>
            <iframe className='embed-responsive-item'
                    src="https://www.youtube.com/embed/5XRaMP4QPwU"
                    frameBorder="0" allowFullScreen>
            </iframe>
          </div>          
        </div>
      </div>
    );
  }
}

export default MotionBlock;