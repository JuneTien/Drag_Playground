import React, { Component } from 'react';
import './App.css';

let scroll;
let startX = 0;
let startY = 0;

let origX = 0;
let origY = 0;
let deltaX = 0;
let deltaY = 0;
let thisMount = null;

// let finalPosLeft = 0;
// let finalPosTop = 0;

class MotionBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    // revert the touch event to mousedown event for mobile
    const mouseEventTypes = {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup',
    };
    // for (const originalType in mouseEventTypes) { 
    for (let i = 0; i < mouseEventTypes.length; i++) {
      // document.addEventListener(originalType, (originalEvent) => {
      document.addEventListener(mouseEventTypes[i], (originalEvent) => {
        const event = document.createEvent('MouseEvents');
        const touch = originalEvent.changedTouches[0];
        event.initMouseEvent(
          mouseEventTypes[originalEvent.type],
          true, true, window, 0,
          touch.screenX, touch.screenY, touch.clientX, touch.clientY,
          touch.ctrlKey, touch.altKey, touch.shiftKey, touch.metaKey,
          0, null);
        originalEvent.target.dispatchEvent(event);
      });
    }
  }

  onDrag = (e) => {
    document.ontouchmove = (event) => {
      event.preventDefault();
    };

    scroll = this.getScrollOffsets();
    startX = e.clientX + scroll.x;
    startY = e.clientY + scroll.y;

    origX = thisMount.offsetLeft;
    origY = thisMount.offsetTop;
    deltaX = startX - origX;
    deltaY = startY - origY;

    document.addEventListener('mousemove', this.moveHandler, true);
    document.addEventListener('mouseup', this.upHandler, true);

    if (document.addEventListener) {
      document.addEventListener('mousemove', this.moveHandler, true);
      document.addEventListener('mouseup', this.upHandler, true);
    } else if (document.attachEvent) {
      thisMount.setCapture();
      thisMount.attachEvent('onmousemove', this.moveHandler);
      thisMount.attachEvent('onmouseup', this.upHandler);
      thisMount.attachEvent('onlosecapture', this.upHandler);
    }

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  }

  getScrollOffsets = () => {
    const w = window;
    // w = w || window;
    if (w.pageXOffset != null) return { x: w.pageXOffset, y: w.pageYOffset };
    const d = w.document;
    if (document.compatMode === 'CSS1Compat') { return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop }; }

    return { x: d.body.scrollLeft, y: d.body.scrollTop };
  }

  moveHandler = (e) => {
    // if (!e) e = window.event;
    scroll = this.getScrollOffsets();
    thisMount.style.left = `${(e.clientX + scroll.x) - deltaX}px`;
    thisMount.style.top = `${(e.clientY + scroll.y) - deltaY}px`;
  }

  upHandler = (e) => {
    // if (!e) e = window.event;
    if (document.removeEventListener) {
      document.removeEventListener('mouseup', this.upHandler, true);
      document.removeEventListener('mousemove', this.moveHandler, true);
    } else if (document.detachEvnet) {
      thisMount.detachEvent('onlosecapture', this.upHandler);
      thisMount.detachEvent('onmouseup', this.upHandler);
      thisMount.detachEvent('onmousemove', this.moveHandler);
    }

    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }

  render() {
    return (
      <div className="container">
        <div className="App-header App">
          <span>Drag Playground, hello React ! :D</span>
        </div>
        <div ref={(div) => { thisMount = div; }} onMouseDown={this.onDrag} style={{ position: 'absolute' }}>
          <div style={{ height: 50, cursor: 'move', backgroundColor: '#d1f4ff', textAlign: 'center', lineHeight: '50px' }}>
            <span>Drag here !</span>
          </div>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              title="embed"
              className="embed-responsive-item"
              src="https://www.youtube.com/embed/5XRaMP4QPwU"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MotionBlock;
