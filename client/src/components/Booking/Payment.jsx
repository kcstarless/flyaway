

const Payment = () => {
    return (
        <>
        <div className="fare-details">
            <div>Total Amount: </div>
            <div>Fee breakdown: </div>
            <div>Taxes:</div>
            <div>Included:</div>
        </div>
        <form className="payment">
            <fieldset>

                <div className="item">
                    <div className="item-title">Card No.</div>
                    <div className="item-input"><input type="text"></input></div>
                </div>
                <div className="item">
                    <div className="item-title">Expiry date.</div>
                    <div className="item-input"><input type="text"></input></div>
                </div>

                <div className="item">
                    <div className="item-title">Security code (CVC)</div>
                    <div className="item-input"><input type="text"></input></div>
                </div>
            </fieldset>
        </form>
        </>
    )
}

export default Payment