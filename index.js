#!/usr/bin/env node

`use strict` ;

const colors = require ( `colors` ) ;

const express = require ( `express` ) ;

const fetch = require ( `node-fetch` ) ;

const app = express () ;

app . use ( express . static ( `frontend` ) ) ;

app . get ( `/search` , async ( request , response ) =>
	{
		try
		{
			if ( ! request . query . terms )
			{
				response . status ( 400 ) . json ( { response : `One or more search terms are required.` } ) ;
				return ;
			}
			const search = encodeURI ( `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${ request . query . terms }&gsrlimit=20&prop=pageimages|extracts&exchars=${ request . query . chars }&exintro&explaintext&exlimit=max&format=json&origin=*` ) ;
			const results = await fetch ( search ) ;
			response . status ( 200 ) . json ( await results . json () ) ;
			return ;
		}
		catch ( err )
		{
			console . error ( err . message . brightRed ) ;
			response . status ( 500 ) . json ( { response : `Error searching for public information.` } ) ;
			return ;
		}
	}
) ;

const port = process . env . PORT || 5000 ;

app . listen ( port , () =>
	{
		console . log ( `info-searcher listening on port: ` . brightWhite , `${ port }` . brightGreen ) ;
		return ;
	}
) ;
