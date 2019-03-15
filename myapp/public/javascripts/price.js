const USCURRENCY = "US Dollar";
const CHNCURRENCY = "Chinese Yuan";

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) {
  setCookie(name, '', -1);
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
        <label> {this.props.name} </label>
        <select name={this.props.name} id={this.props.name} value={this.props.selected} onChange={e => this.props.onChange(e.target.value)}>
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
    const chPrice = this.props.currency == CHNCURRENCY ? this.props.prices.chPrice : this.props.prices.chPrice * exchangeRate["CTU"];
    const usPrice = this.props.currency == USCURRENCY ? this.props.prices.usPrice : this.props.prices.usPrice * exchangeRate["UTC"];

    const tax = usPrice * (states[this.props.state] / 100);
    const difference = (usPrice + tax) - chPrice;

    const priceSymbol = this.props.currency == CHNCURRENCY ? '￥' : '$';

    return (
      <table className="table">
        <thead>
          <tr>
            <th className="cell">US Name</th>
            <th className="cell">US Price</th>
            <th className="cell">China Name</th>
            <th className="cell">China Price</th>
            <th className="cell">Difference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="cell"> {this.props.prices.usName} </td>
            <td className="cell"> {priceSymbol + usPrice.toFixed(2)} + ({this.props.state} tax: {priceSymbol + tax.toFixed(2)}) = {priceSymbol + (usPrice + tax).toFixed(2)} </td>
            <td className="cell"> {this.props.prices.chName} </td>
            <td className="cell"> {priceSymbol + chPrice.toFixed(2)} </td>
            <td className="cell"> {priceSymbol + difference.toFixed(2)} </td>
          </tr>
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
      state: getCookie("pricestate") || props.states[0]
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
          <PriceTable currency={this.state.currency} state={this.state.state} prices={this.props.prices} />
        </div>
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
}

// ReactDOM.render(<CurrencySelect />, document.getElementById("root"));
// alert(states);

// deleteCookie("pricecurrency");
// deleteCookie("pricestate");

ReactDOM.render(<PriceComp states={Object.keys(states)} prices={prices} />, document.getElementById("root"));