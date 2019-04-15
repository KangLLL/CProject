class ProductTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rows = this.props.products.map((product, step) => {
      return (
        <tr key={step} onClick={e => { this.props.onChange(step); }}>
          <td width="70%" className="cell">
            <a target="_blank" href={"https://www.amazon.com" + product.url}>
              <strong> {product.name} </strong>
            </a>
          </td>
          <td width="30%" height="100" className="cell">
            <img src={product.image} width="100%" height="100%" style={{objectFit: "contain"}}/>
          </td>
        </tr>
      );
    });

    return (
      <table className="table table-hover" >
        <thead className="thead-inverse">
          <tr>
            <th className="cell">Name</th>
            <th className="cell">Photo</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

class CompareTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rows = this.props.products.map((product, step) => {
      return (
        <tr key={step} onClick={e => { this.getPrice(this.props.usProduct.name.replace(/'/g, "\\'"), product.name.replace(/'/g, "\\'")); }}>
          <td width="20%" className="cell">
            <a target="_blank" href={"https://www.amazon.com" + this.props.usProduct.url}>
              <strong> {this.props.usProduct.name} </strong>
            </a>
          </td>
          <td width="30%" height="200" className="cell">
            <img src={this.props.usProduct.image} width="100%" height="100%" style={{objectFit: "contain"}}/>
          </td>
          <td width="20%" className="cell">
            <a target="_blank" href={product.url}>
              <strong> {product.name} </strong>
            </a>
          </td>
          <td width="30%" height="200" className="cell">
            <img src={product.image} width="100%" height="100%" style={{objectFit: "contain"}}/>
          </td>
        </tr>
      );
    });

    return (
      <table className="table table-hover" >
        <thead className="thead-inverse">
          <tr>
            <th className="cell">US Name</th>
            <th className="cell">US Photo</th>
            <th className="cell">China Name</th>
            <th className="cell">China Photo</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  getPrice(usName, chName) {
    usName = usName.replace(/\\'/g, "'");
    chName = chName.replace(/\\'/g, "'");
    location = "./search/price?name=" + encodeURIComponent(usName) + "&chName=" + encodeURIComponent(chName);
  }
}

class ResultComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usId: 0
    }
  }

  render() {
    return this.state.usId < 0 ? (
      <div className="container">
        <div className="row">
          <h4 className="text-danger">Please select which product you are searching for</h4>
        </div>
        <br>
        </br>
        <ProductTable products={usProducts} onChange={id => { this.handleProductChange(id); }} />
      </div>
    ) :
      (
        <div className="container">
          <div className="row">
            <h4 className="text-danger">Please select which product you want to compare</h4>
          </div>
          <br />
          <CompareTable usProduct={usProducts[this.state.usId]} products={chProducts} />
          <br />
          <input className="btn btn-info" type="submit" value="Show more US products" onClick={s => this.setState({ usId: -1 })} />
        </div>
      );
  }

  handleProductChange(id) {
    this.setState({ usId: id });
  }
}

ReactDOM.render(<ResultComp />, document.getElementById("root"));