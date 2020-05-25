import React from "react"
import { StaticQuery, graphql, withPrefix } from 'gatsby'
import Img from "gatsby-image"

/**
 * wrapper class to use the Img class from gatsby-image for dynamically loaded images
 */
class Image extends React.Component {


  render() {

    return (
      <StaticQuery
        query={graphql`
            query {
              allImageSharp {
                edges {
                  node {
                    fluid(maxWidth: 1200) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          `}
        render={data => {
          if (this.props.imgsrc.startsWith("http") || this.props.imgsrc.startsWith("data:image") ) {
            return <img
              src={this.props.imgsrc}
              alt={this.props.alt}
              className={this.props.className} />
          } else {
            const fluid = data.allImageSharp.edges.find((element) => {
              // Match string after final slash
              return (element.node.fluid.src.endsWith(this.props.imgsrc));
            }).node.fluid
            // on github pages the site isnt deployed as root application but under /my-cookbook thats why the paths have to be corrected
            if (fluid.src.startsWith("/static")) {
              fluid.src = withPrefix(fluid.src)
              fluid.srcSet = fluid.srcSet.split(",").map(i => i.trim().split(" ").map((j, idx) => idx === 0 ? withPrefix(j) : j).join(" ")).join(",\n")
            }
            return (
              <Img
                alt={this.props.alt}
                className={this.props.className}
                fluid={fluid} />
            )
          }
        }}
      />
    )
  }

}

export default Image;

