import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public raizIconos = '../../../assets/icons/';
  public logo = '../../../assets/images/LinkedIn.svg';

  public iconos = [
    {
      Nombre: 'Brujula',
      Extension: '.svg',
      Texto: 'Descubrir',
    },
    {
      Nombre: 'Personas',
      Extension: '.svg',
      Texto: 'Personas',
    },
    {
      Nombre: 'Video',
      Extension: '.svg',
      Texto: 'Learning',
    },
    {
      Nombre: 'Maletin',
      Extension: '.svg',
      Texto: 'Empleos',
    },
  ];

  public getUbicacionIcono(nombreIcono: String) {
    let iconoBuscado!: any;

    this.iconos.forEach(icono => {
      if (icono.Nombre.toLowerCase() === nombreIcono.toLowerCase()) {
        iconoBuscado = icono;
      }
    });

    return iconoBuscado ? this.raizIconos + iconoBuscado.Nombre + iconoBuscado.Extension : null;
  }
}
