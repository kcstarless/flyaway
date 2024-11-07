
export const LoaderPlane = () => {
    return (
        <dialog className="loading-screen-dialog" open> 
        <svg width="200" height="100" >
          <defs>
            <path id="curve" d="M 18,50, Q 100,-8 182,51" fill="transparent"/>
          </defs>
          <text fill="black" className='curved-letters'>
            <textPath href="#curve">
              Searching for flights...
            </textPath>
          </text>
        </svg>
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
    );
}

