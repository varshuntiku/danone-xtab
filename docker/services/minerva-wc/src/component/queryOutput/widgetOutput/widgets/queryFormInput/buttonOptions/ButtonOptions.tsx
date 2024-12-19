import { buttonVariantToClass } from "../../../../../../util";
import "./buttonOptions.scss";
export default function ButtonOptions({params, onClick, disabled = false}) {
    return (<div className="MinervaButtonOptions">
        {params?.buttons?.map((btnItem, index) => {
            if (!btnItem) {
                return <div style={{flex: 1}}> </div>
            }

            return (<button
                    key={btnItem.label + ' ' + index}
                    className={buttonVariantToClass(btnItem?.variant, btnItem?.size)}
                    onClick={() => {
                        onClick(btnItem);
                    }}
                    disabled={disabled}
                >
                    {btnItem.label || btnItem.query}
                </button>)
        })}
    </div>)
}