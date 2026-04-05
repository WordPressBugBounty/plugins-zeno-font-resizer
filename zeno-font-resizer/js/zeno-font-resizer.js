/*

WordPress Plugin: Zeno Font Resizer.
Plugin URI: https://wordpress.org/plugins/zeno-font-resizer/

Copyright 2010 - 2013  Cubetech GmbH
Copyright 2015 - 2026  Marcel Pol  (marcel@timelord.nl)
License: GPLv2 or later

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/


document.addEventListener('DOMContentLoaded', function () {

	var zeno_font_resizer_settings = {
		element:     zeno_font_resizer_script.element,
		resizemax:   parseInt( zeno_font_resizer_script.resizemax ),
		resizemin:   parseInt( zeno_font_resizer_script.resizemin ),
		resizesteps: parseFloat( zeno_font_resizer_script.resizesteps ),
		cookietime:  parseInt( zeno_font_resizer_script.cookietime ),
		startsize:   parseFloat( zeno_font_resizer_get_fontsize() ), // Runs before applying the saved size below.
	};


	// restore previous setting from cookie into html fontsize. Runs after setting the startsize in settings.
	var savedsize = parseFloat( zeno_font_resizer_get_cookie() );
	if ( savedsize > zeno_font_resizer_script.resizemin && savedsize < zeno_font_resizer_script.resizemax ) {
		zeno_font_resizer_set_fontsize( savedsize );
	}


	/*
	 * Will set the fontsize of the desired element.
	 * Will also save this in a cookie.
	 * Will not do anything in case the html element does not exist.
	 *
	 * @param fontsize float desired fontsize to be set.
	 *
	 * @since 2.0.0
	 */
	function zeno_font_resizer_set_fontsize( fontsize ) {

		var element_name = zeno_font_resizer_settings.element;
		if ( element_name ) {
			var element = document.querySelector( element_name );
			if ( element ) {

				element.style.fontSize = fontsize + 'px';

				zeno_font_resizer_set_cookie( fontsize );

			}
		}

	}


	/*
	 * Will get the current fontsize of the desired element.
	 *
	 * Takes 3 steps to arrive at 1 value; have 15 as default, use the html element, and use the custom element.
	 * The last found value will be used.
	 *
	 * @return fontsize float the current fontsize.
	 *
	 * @since 2.0.0
	 */
	function zeno_font_resizer_get_fontsize() {

		var fontsize = 15;

		var element_name = 'html';
		if ( element_name ) {
			var element = document.querySelector( element_name );
			if ( element ) {
				fontsize = element.style.fontSize;
				if ( ! fontsize ) {
					fontsize = getComputedStyle(element).fontSize;
				}
			}
		}

		var element_name = zeno_font_resizer_script.element;
		if ( element_name ) {
			var element = document.querySelector( element_name );
			if ( element ) {
				fontsize = element.style.fontSize;
				if ( ! fontsize ) {
					fontsize = getComputedStyle(element).fontSize;
				}
			}
		}

		if ( typeof fontsize === 'string' || fontsize instanceof String ) {
			fontsize = fontsize.replace( 'px', '' );
		}

		return parseFloat( fontsize );

	}


	/*
	 * Will save the new fontsize in a cookie.
	 *
	 * @param fontsize float the desired fontsize to be set.
	 *
	 * @since 2.0.0
	 */
	function zeno_font_resizer_set_cookie( fontsize ) {

		var expires;
		var days = parseInt( zeno_font_resizer_settings.cookietime );

		if ( days ) {
			var date = new Date();
			date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
			expires = '; expires=' + date.toGMTString();
		} else {
			expires = '';
		}

		document.cookie = 'fontSize=' + parseFloat( fontsize ) + expires + "; path=/";

	}


	/*
	 * Will get the fontsize from a cookie.
	 *
	 * @return fontsize string the value of the cookie.
	 *
	 * @since 2.0.0
	 */
	function zeno_font_resizer_get_cookie() {

		var name = 'fontSize';
		if ( document.cookie.length > 0 ) {
			c_start = document.cookie.indexOf( name + "=");
			if ( c_start != -1 ) {
				c_start = c_start + name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if ( c_end == -1 ) {
					c_end = document.cookie.length;
				}
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}

		return '';

	}


	document.querySelectorAll( '.zeno_font_resizer_add' ).forEach( button => {
		button.addEventListener( 'click', function (e) {

			var fontsize = zeno_font_resizer_get_fontsize();
			var resizesteps = parseFloat( zeno_font_resizer_settings.resizesteps );
			var startsize = parseFloat( zeno_font_resizer_settings.startsize );
			var newfontsize = fontsize + resizesteps;
			var maxfontsize = startsize + ( resizesteps * 5 ); // max 5 steps
			if ( newfontsize > maxfontsize) {
				return false;
			}
			if ( newfontsize > zeno_font_resizer_settings.resizemax ) {
				return false;
			}
			newfontsize = newfontsize.toFixed(2); // rounded to 2 decimals and converted to string.

			zeno_font_resizer_set_fontsize( parseFloat( newfontsize ) );

			e.preventDefault();
			return false;

		});
	});


	document.querySelectorAll( '.zeno_font_resizer_minus' ).forEach( button => {
		button.addEventListener( 'click', function (e) {

			var fontsize = zeno_font_resizer_get_fontsize();
			var resizesteps = parseFloat( zeno_font_resizer_settings.resizesteps );
			var startsize = parseFloat( zeno_font_resizer_settings.startsize );
			var newfontsize = fontsize - resizesteps;
			var minfontsize = startsize - ( resizesteps * 5 ); // max 5 steps
			if ( newfontsize < minfontsize) {
				return false;
			}
			if ( newfontsize < zeno_font_resizer_settings.resizemin ) {
				return false;
			}
			newfontsize = newfontsize.toFixed(2); // rounded to 2 decimals and converted to string.

			zeno_font_resizer_set_fontsize( parseFloat( newfontsize ) );

			e.preventDefault();
			return false;

		});
	});


	document.querySelectorAll( '.zeno_font_resizer_reset' ).forEach( button => {
		button.addEventListener( 'click', function (e) {

			zeno_font_resizer_set_fontsize( zeno_font_resizer_settings.startsize );

			e.preventDefault();
			return false;

		});
	});

});
