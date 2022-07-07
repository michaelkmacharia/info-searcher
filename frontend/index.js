#!/usr/bin/env node

`use strict` ;

const results = document . querySelector ( `#results` ) ;

const results_count = document . querySelector ( `#results-count` ) ;

const terms = document . querySelector ( `#terms` ) ;

const clear = ( ( request ) =>
	{
		request . preventDefault () ;
		results . innerHTML = `` ;
		results_count . innerHTML = `` ;
		terms . value = `` ;
		terms . focus () ;
		document . querySelector ( `#clear` ) . classList . add ( `hide` ) ;
		document . querySelector ( `#download` ) . classList . add ( `hide` ) ;
		return ;
	}
) ;

const download = ( async ( request ) =>
	{
		request . preventDefault () ;
		const terms_value = terms . value . trim () . replaceAll ( /[ ]{2,}/gi , ` ` ) ;
		if ( terms_value === `` )
		{
			results . innerHTML = `<div class="alert alert-danger" role="alert">One or more search terms are required.</div>` ;
			return ;
		}
		progress ( true ) ;
		const client_width = window . innerWidth || document . body . clientWidth ;
		let maximum_characters ;
		if ( client_width < 414 )
		{
			maximum_characters = 65 ;
		}
		else if ( 414 >= client_width < 1400 )
		{
			maximum_characters = 100 ;
		}
		else
		{
			maximum_characters = 130 ;
		}
		const response = await fetch ( `/search/?terms=${ terms_value }&chars=${ maximum_characters }` ) ;
		if ( response . status !== 200 )
		{
			progress ( false ) ;
			results . innerHTML = `<div class="alert alert-danger" role="alert">Error searching for public information.</div>` ;
			return ;
		}
		const search_results = await response . json () ;
		if ( ! search_results . hasOwnProperty ( `query` ) )
		{
			progress ( false ) ;
			results . innerHTML = `<div class="alert alert-warning" role="alert">No related results found.</div>` ;
			return ;
		}
		const all_results = new Array () ;
		Object . keys ( search_results [ `query` ] [ `pages` ] ) . forEach ( ( key ) =>
			{
				let pageid = search_results [ `query` ] [ `pages` ] [ key ] . pageid ;
				let extract = search_results [ `query` ] [ `pages` ] [ key ] . extract ;
				let thumbnail = ( search_results [ `query` ] [ `pages` ] [ key ] . hasOwnProperty ( `thumbnail` ) ) ? ( search_results [ `query` ] [ `pages` ] [ key ] . thumbnail . source ) : ( `` ) ;
				let title = search_results [ `query` ] [ `pages` ] [ key ] . title ;
				let one_result = { pageid : pageid , extract : extract , thumbnail : thumbnail , title : title } ;
				all_results . push ( one_result ) ;
				return ;
			}
		) ;
		if ( all_results . length === 0 )
		{
			results . innerHTML = `<div class="alert alert-warning" role="alert">Error generating your search results' CSV file.</div>` ;
			return ;
		}
		const csv = all_results . map ( ( one_result ) =>
			{
				return ( `${ one_result . extract } , ${ one_result . thumbnail } , ${ one_result . title }` ) ;
			}
		) . join ( `\n` ) ;
		const csv_blob = new Blob ( [ csv ] , { type : `text/csv` } ) ;
		const csv_url = URL . createObjectURL ( csv_blob ) ;
		const csv_link = document . createElement ( `a` ) ;
		csv_link . href = csv_url ;
		csv_link . download = `info-searcher-results-` + csv_url . substring ( 12 ) + `.csv` ;
		document . body . appendChild ( csv_link ) ;
		csv_link . click () ;
		document . body . removeChild ( csv_link ) ;
		progress ( false ) ;
		return ;
	}
) ;

const escape = ( ( html ) =>
	{
		return ( html . replace ( /&/g , `&amp;` ) . replace ( /</g , `&lt;` ) . replace ( />/g , `&gt;` ) . replace ( /"/g , `&quot;` ) . replace ( /`/g , `&#039;` ) ) ;
	}
) ;

const progress = ( ( loading ) =>
	{
		const load = document . querySelector ( `.load` ) ;
		if ( loading )
		{
			load . style . display = `block` ;
			return ;
		}
		load . style . display = `none` ;
		return ;
	}
) ;

const show = ( ( search_results ) =>
	{
		results . innerHTML = `` ;
		results_count . innerHTML = `` ;
		const all_results = new Array () ;
		if ( search_results . hasOwnProperty ( `query` ) )
		{
			Object . keys ( search_results [ `query` ] [ `pages` ] ) . forEach ( ( key ) =>
				{
					let pageid = search_results [ `query` ] [ `pages` ] [ key ] . pageid ;
					let extract = search_results [ `query` ] [ `pages` ] [ key ] . extract ;
					let thumbnail = ( search_results [ `query` ] [ `pages` ] [ key ] . hasOwnProperty ( `thumbnail` ) ) ? ( search_results [ `query` ] [ `pages` ] [ key ] . thumbnail . source ) : ( `` ) ;
					let title = search_results [ `query` ] [ `pages` ] [ key ] . title ;
					let one_result = { pageid : pageid , extract : extract , thumbnail : thumbnail , title : title } ;
					all_results . push ( one_result ) ;
					return ;
				}
			) ;
		}
		if ( all_results . length === 0 )
		{
			results . innerHTML = `<div class="alert alert-warning" role="alert">No related results found.</div>` ;
			return ;
		}
		results_count . innerHTML = `<p class="alert alert-primary">${ all_results . length } related results found.</p>` ;
		all_results . forEach ( ( one_result ) =>
			{
				let output = `<div class="card mb-3 rounded"><div class="card-body"><h5><a class="" href="https://en.wikipedia.org/?curid=${ one_result . pageid }" target="_blank">${ escape ( one_result . title ) }</a></h5><img class="block" src="${ one_result . thumbnail }" alt="${ escape ( one_result . title ) }" /><p class="">${ escape ( one_result . extract ) }</p></div></div>` ;
				results . innerHTML += output ;
				return ;
			}
		) ;
		return ;
	}
) ;

const search = ( async ( request ) =>
	{
		request . preventDefault () ;
		const terms_value = terms . value . trim () . replaceAll ( /[ ]{2,}/gi , ` ` ) ;
		if ( terms_value === `` )
		{
			results . innerHTML = `<div class="alert alert-danger" role="alert">One or more search terms are required.</div>` ;
			return ;
		}
		progress ( true ) ;
		const client_width = window . innerWidth || document . body . clientWidth ;
		let maximum_characters ;
		if ( client_width < 414 )
		{
			maximum_characters = 65 ;
		}
		else if ( 414 >= client_width < 1400 )
		{
			maximum_characters = 100 ;
		}
		else
		{
			maximum_characters = 130 ;
		}
		const response = await fetch ( `/search/?terms=${ terms_value }&chars=${ maximum_characters }` ) ;
		if ( response . status !== 200 )
		{
			progress ( false ) ;
			results . innerHTML = `<div class="alert alert-danger" role="alert">Error searching for public information.</div>` ;
			return ;
		}
		const search_results = await response . json () ;
		show ( search_results ) ;
		progress ( false ) ;
		document . querySelector ( `#clear` ) . classList . remove ( `hide` ) ;
		document . querySelector ( `#download` ) . classList . remove ( `hide` ) ;
		return ;
	}
) ;

document . querySelector ( `#clear` ) . addEventListener ( `click` , clear ) ;

document . querySelector ( `#download` ) . addEventListener ( `click` , download ) ;

document . querySelector ( `#search` ) . addEventListener ( `submit` , search ) ;
