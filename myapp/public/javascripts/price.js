const USCURRENCY = "US Dollar";
const CHNCURRENCY = "Chinese Yuan";

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : 1;
}

function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
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
        <label for={this.props.name}> {this.props.name} </label>
        <select name={this.props.name} id={this.props.name} value={this.props.selected} onChange={e => this.props.onChange(e.target)}>
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
    const rows = this.props.products.map((product, step) => {
      const chPrice = this.proos.currency == CHNCURRENCY ? product.chPrice : product.chPrice * exchangeRate["CTU"];
      const usPrice = this.props.currency == USCURRENCY ? product.usPrice : product.usPrice * exchangeRate["UTC"];
      const tax = usPrice * (1 + states[this.props.state]);
      const difference = (usPrice + tax) - chPrice;

      return (
        <tr>
          <td className="cell"> {product.name} </td>
          <td className="cell"> {usPrice} + ({this.state.state} tax: {tax}) = {usPrice + tax} </td>
          <td className="cell"> {chPrice} </td>
          <td className="cell"> {difference} </td>
        </tr>
      );
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th className="cell">Product Name</th>
            <th className="cell">US Price</th>
            <th className="cell">China Price</th>
            <th className="cell">Difference</th>
          </tr>
        </thead>
      </table>
    );
  }
}

class PriceComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: getCookie("currency") || USCURRENCY,
      state: getCookie("state") || props.states[0]
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
          <PriceTable currency={this.state.currency} state={this.state.state} />
        </div>
      </div>
    );
  }

  handleCurrencyChange(currency) {
    setCookie("currency", currency, 30);
    this.setState({ currency: currency });
  }

  handleStateChange(state) {
    setCookie("state", state, 30);
    this.setState({ state: state });
  }
}

// ReactDOM.render(<CurrencySelect />, document.getElementById("root"));
// alert(states);
ReactDOM.render(<PriceComp states={states} />, document.getElementById("root"));