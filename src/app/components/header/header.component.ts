import { Component, OnInit } from '@angular/core';
import { Icono } from 'src/app/interfaces/icono';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public raizIconos = '../../../assets/icons/';
  public logo = '../../../assets/images/LinkedIn.svg';

  public iconos: Icono[] = [
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

  public getDatosIcono(nombreIcono: String, accion: number) {
    // Accion -> 1.- get Ubicación
    // Accion -> 2.- get Alt
    let iconoBuscado!: any;

    this.iconos.forEach(icono => {
      if (icono.Nombre.toLowerCase() === nombreIcono.toLowerCase()) {
        iconoBuscado = icono;
      }
    });

    switch (accion) {
      case 1:
        return this.getUbicacionIcono(iconoBuscado);
      case 2:
        return this.getTextoAltIcono(iconoBuscado);
    }

    return null;
  }

  public getUbicacionIcono(icono: Icono) {
    return this.raizIconos + icono.Nombre + icono.Extension;
  }

  public getTextoAltIcono(icono: Icono) {
    return 'Enlace al apartado ' + icono.Texto;
  }
}
