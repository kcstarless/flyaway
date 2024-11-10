
export const LoaderPlane = ({ messageTop, messageBottom }) => {
    return (
      <>
        <dialog className="loading-screen-dialog" open> 
          {/* <svg width="400" height="200" className="arc-svg">
            <defs>
            <path id="curve" d="M 50,100 Q 200,-50 350,100" fill="transparent"/>


            </defs>
            <text fill="black">
              <textPath href="#curve">
                {messageTop}
              </textPath>
            </text>
          </svg> */}
          <div className="top-text">{messageTop}</div>
          <div className="bottom-text">{messageBottom}</div>
          <div className="plane-loader" open>
                <div className="cloud cloud1"></div>
                <div className="cloud cloud4"></div>
                <div className="cloud cloud3"></div>
                <div className="plane"></div>
                <div className="cloud cloud2"></div>
                <div className="steam steam1">
                    <div className="c1"></div>
                    <div className="c2"></div>
                    <div className="c3"></div>
                    <div className="c4"></div>
                    <div className="c5"></div>
                    <div className="c6"></div>
                    <div className="c7"></div>
                    <div className="c8"></div>
                    <div className="c9"></div>
                    <div className="c10"></div>
                </div>
                <div className="steam steam2">
                    <div className="c1"></div>
                    <div className="c2"></div>
                    <div className="c3"></div>
                    <div className="c4"></div>
                    <div className="c5"></div>
                    <div className="c6"></div>
                    <div className="c7"></div>
                    <div className="c8"></div>
                    <div className="c9"></div>
                    <div className="c10"></div>
                </div>
                <div className="steam steam3">
                    <div className="c1"></div>
                    <div className="c2"></div>
                    <div className="c3"></div>
                    <div className="c4"></div>
                    <div className="c5"></div>
                    <div className="c6"></div>
                    <div className="c7"></div>
                    <div className="c8"></div>
                    <div className="c9"></div>
                    <div className="c10"></div>
                </div>
                <div className="steam steam4">
                    <div className="c1"></div>
                    <div className="c2"></div>
                    <div className="c3"></div>
                    <div className="c4"></div>
                    <div className="c5"></div>
                    <div className="c6"></div>
                    <div className="c7"></div>
                    <div className="c8"></div>
                    <div className="c9"></div>
                    <div className="c10"></div>
                </div>  
                
          </div>
          
        </dialog>
        </>
    );
}

