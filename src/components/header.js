import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import logo from "../images/logo-white.svg"
import { Animated } from "react-animated-css";

/**
 * a header that is shown on the top of each site. It has a background picture and shows the title of the page dynamically
 * @param {string} siteTitle 
 */

class Header extends React.Component {
  render() {
    return (

      <section id="logo">
        <Animated animationIn="pulse" animationOut="pulse" isVisible={true} className="container text-center wow">

          <img src={logo} alt="logo" />
          <br />
          <h1><Link style={{ color: "white" }} to="/">{this.props.siteTitle}</Link></h1>

        </Animated>

      </section>

    )
  }
}


Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header


