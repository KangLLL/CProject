const USCURRENCY = "US Dollar";
const CHNCURRENCY = "Chinese Yuan";

const USTOCHN = "From US to China";
const CHNTOUS = "From China to US";

function getCookie(name) {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}

class CookieSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = this.props.options.map((option, step) => {
      return (
        <option key={option} value={option}> {option} </option>
      );
    });

    return (
      <div className="col-sm-5">
        <label className="mr-sm-2"> {this.props.name} </label>
        <select className="custom-select mr-sm-2" name={this.props.name} id={this.props.name} value={this.props.selected} onChange={e => this.props.onChange(e.target.value)}>
          {options}
        </select>
      </div>
    );
  }
}

class PriceTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const priceSymbol = this.props.currency == CHNCURRENCY ? "￥" : "$";

    var temp = (showRowNumber && this.props.direction == CHNTOUS) ? this.props.chnPrices : this.props.prices;

    const rows = temp.map((price, step) => {

      const chPrice = this.props.currency == CHNCURRENCY ? price.chPrice : price.chPrice * exchangeRate["CTU"];
      const usPrice = this.props.currency == USCURRENCY ? price.usPrice : price.usPrice * exchangeRate["UTC"];
      const tax = usPrice * (states[this.props.state] / 100);
      const usPriceDescription = usPrice.toFixed(2) + " (" + this.props.state + " tax: " + priceSymbol + tax.toFixed(2) + ") = " + priceSymbol + (usPrice + tax).toFixed(2);
      const difference = chPrice - (usPrice + tax);
      const profit = price.weight ? difference / price.weight : 0;
      return (
        <tr key={step} className={!showRowNumber || step >= 3 ? "" : step == 2 ? "table-warning" : step == 1 ? "table-primary" : "table-success"}>
          {showRowNumber && <th scope="row"> {step + 1} </th>}
          <td className="cell"> 
            <a target="_blank" href={this.props.direction == USTOCHN ? "https://www.amazon.com" + price.url : price.churl}>
              <strong>{this.props.direction == USTOCHN ? price.usName : price.chName}</strong>
            </a> 
          </td>
          <td className="cell"> {priceSymbol + (this.props.direction == USTOCHN ? usPriceDescription : chPrice.toFixed(2))} </td>
          <td className="cell">
            <a target="_blank" href={this.props.direction == USTOCHN ? price.churl : "https://www.amazon.com" + price.url}>
              <strong>{this.props.direction == USTOCHN ? price.chName : price.usName}</strong>
            </a> 
          </td>
          <td className="cell"> {priceSymbol + (this.props.direction == USTOCHN ? chPrice.toFixed(2) : usPriceDescription)} </td>
          <td className="cell"> {priceSymbol + (this.props.direction == USTOCHN ? difference.toFixed(2) : -difference.toFixed(2))} </td>
          {showRowNumber && <td className="cell"> {priceSymbol + (this.props.direction == USTOCHN ? profit.toFixed(2) : -profit.toFixed(2))} </td>}
        </tr>
      );
    });

    return (
      <table className="table">
        <thead className="thead-inverse">
          <tr>
            {showRowNumber && <th className="cell"> # </th>}
            <th className="cell"> {this.props.direction == USTOCHN ? "US Name" : "China Name"}</th>
            <th className="cell">{this.props.direction == USTOCHN ? "US Price" : "China Price"}</th>
            <th className="cell">{this.props.direction == USTOCHN ? "China Name" : "US Name"}</th>
            <th className="cell">{this.props.direction == USTOCHN ? "China Price" : "US Price"}</th>
            <th className="cell">Difference</th>
            {showRowNumber && <th className="cell">Profit(per 1 pound)</th>}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

class PriceComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: getCookie("pricecurrency") || USCURRENCY,
      state: getCookie("pricestate") || props.states[0],
      direction: getCookie("pricedirection") || USTOCHN
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <CookieSelect name="Currency" options={[USCURRENCY, CHNCURRENCY]} selected={this.state.currency} onChange={c => this.handleCurrencyChange(c)} />
          <div className="col-sm-1">
          </div>
          <CookieSelect name="State" options={this.props.states} selected={this.state.state} onChange={t => this.handleStateChange(t)} />
        </div>
        <div className="row">
          <CookieSelect name="Trip Direction" options={[USTOCHN, CHNTOUS]} selected={this.state.direction} onChange={d => this.handleDirectionChange(d)} />
        </div>
        <PriceTable currency={this.state.currency} state={this.state.state} direction={this.state.direction} prices={this.props.prices} chnPrices={this.props.chnPrices} />
      </div>
    );
  }

  handleCurrencyChange(currency) {
    setCookie("pricecurrency", currency, 30);
    this.setState({ currency: currency });
  }

  handleStateChange(state) {
    setCookie("pricestate", state, 30);
    this.setState({ state: state });
  }

  handleDirectionChange(direction) {
    setCookie("pricedirection", direction, 30);
    this.setState({ direction: direction });
  }
}

ReactDOM.render(<PriceComp states={Object.keys(states)} prices={prices} chnPrices={chnPrices} />, document.getElementById("root"));