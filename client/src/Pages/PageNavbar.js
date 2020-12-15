import React from "react";

export default class PageNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navDivs: [],
    };
  }

  componentDidMount() {
    const pageList = ["2DIY4","restaurants","recipes"];

    let navbarDivs = pageList.map((page, i) => {
      if (this.props.active === page) {
        return (
          <a className="nav-item nav-link active" key={i} href={"/" + page}>
            {page.charAt(0).toUpperCase() + page.substring(1, page.length)}
          </a>
        );
      } else {
        return (
          <a className="nav-item nav-link" key={i} href={"/" + page}>
            {page.charAt(0).toUpperCase() + page.substring(1, page.length)}
          </a>
        );
      }
    });

    this.setState({
      navDivs: navbarDivs,
    });
  }

  render() {
    return (
      <div className="PageNavbar">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">{this.state.navDivs}</div>
          </div>
        </nav>
      </div>
    );
  }
}
