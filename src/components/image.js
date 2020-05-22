import React from "react"
import { StaticQuery, graphql } from 'gatsby'
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
          return (
            <Img
              alt={this.props.alt}
              className={this.props.className}
              fluid={data.allImageSharp.edges.find((element) => {
                // Match string after final slash
                return (element.node.fluid.src.split('/').pop() === this.props.imgsrc);
              }).node.fluid} />
          )
        }}
      />
    )
  }

}

export default Image;

