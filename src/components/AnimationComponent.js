import React, { Component } from 'react';
import $ from "jquery";
import WOW from 'wowjs';

/**
 * this template uses the library wow.js. 
 * To init the library this component is used after mounting
 */
class AnimationComponent extends Component {

    componentDidMount() {
        new WOW.WOW().init();
        $("#splash").fadeOut();
    }

    /**
     * adds an overlay to the page that gets removed once the component is mounted to create a splash effect when opening the page
     */
    render() {
        return (<div id="splash"></div>);
    }

}

export default AnimationComponent;
