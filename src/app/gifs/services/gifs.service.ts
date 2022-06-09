import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey       : string = 'Q16T9aY8u7HaNRRyAxNuncgmug9cgNzG';
  private servicioUrl  : string = 'https://api.giphy.com/v1/gifs';
  private _historial   : string [] = [];


  //
  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  // solo se llama la primera vez
  constructor(private http: HttpClient){
  // Para añadir el historial cuando se recargue la pagina
  if (localStorage.getItem('historial') ){
    // indico con ! que se que no puede ser null a que no saque error
    this._historial = JSON.parse( localStorage.getItem('historial')! );
    //Se podria hacer en una sola linea de la siguiente manera
    //this._historial = JSON.parse( localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse ( localStorage.getItem('resultados')! );
  }
  }


  buscarGifs( query:string = '' ) {

    query = query.trim().toLowerCase();

    // para evitar repetimos, usamos el includes para saber si ya esta en el array indicamos que si NO (!) esta en el array, entre al unshift
    if (!this._historial.includes( query )) {

      // la propiedad unshif coloca en primer posicion en el array de _historial
      this._historial.unshift( query );

      // con el splice conseguimos indicar el maximo a mostrar, de 0 a 10 (los 10 primeros)
      this._historial = this._historial.splice(0,10);

      // Para guardar las busquedas en local y con persistencia
      localStorage.setItem('historial', JSON.stringify( this._historial ));
    }

    const params = new HttpParams()
          .set( 'api_key', this.apiKey )
          .set( 'limit', '10')
          .set( 'q', query );


    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
    .subscribe( (resp) => {
      console.log(resp.data);
      this.resultados = resp.data;
      // Convierte a Json con JSON.stringify los resultados que le pasamos
      localStorage.setItem('resultados', JSON.stringify( this.resultados ));
    });
  }


}


//Peticion http con fetch
// fetch('https://api.giphy.com/v1/gifs/search?api_key=Q16T9aY8u7HaNRRyAxNuncgmug9cgNzG&q=dragon ball z&limit=10')
// .then (resp => {
//   resp.json().then( data=> {
//     console.log(data);
//   })
// })
