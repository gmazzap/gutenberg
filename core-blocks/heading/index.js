/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { concatChildren } from '@wordpress/element';
import {
	createBlock,
	RichText,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './editor.scss';
import { edit } from './edit';

export const name = 'core/heading';

export const settings = {
	title: __( 'Heading' ),

	description: __( 'Search engines use the headings to index the structure and content of your web pages.' ),

	icon: 'heading',

	category: 'common',

	keywords: [ __( 'title' ), __( 'subtitle' ) ],

	supports: {
		className: false,
		anchor: true,
	},

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'h1,h2,h3,h4,h5,h6',
		},
		nodeName: {
			type: 'string',
			source: 'property',
			selector: 'h1,h2,h3,h4,h5,h6',
			property: 'nodeName',
			default: 'H2',
		},
		align: {
			type: 'string',
		},
		placeholder: {
			type: 'string',
		},
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'core/heading', {
						content,
					} );
				},
			},
			{
				type: 'raw',
				isMatch: ( node ) => /H\d/.test( node.nodeName ),
			},
			{
				type: 'pattern',
				regExp: /^(#{2,6})\s/,
				transform: ( { content, match } ) => {
					const level = match[ 1 ].length;

					return createBlock( 'core/heading', {
						nodeName: `H${ level }`,
						content,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'core/paragraph', {
						content,
					} );
				},
			},
		],
	},

	merge( attributes, attributesToMerge ) {
		return {
			content: concatChildren( attributes.content, attributesToMerge.content ),
		};
	},

	edit: edit,

	save( { attributes } ) {
		const { align, nodeName, content } = attributes;

		return (
			<RichText.Content
				tagName={ nodeName.toLowerCase() }
				style={ { textAlign: align } }
				value={ content }
			/>
		);
	},
};
