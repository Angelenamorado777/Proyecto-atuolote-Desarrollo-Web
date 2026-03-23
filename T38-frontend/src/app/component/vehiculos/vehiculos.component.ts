import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '../../services/vehiculo.service';

@Component({
  selector: 'app-vehiculos',
  imports: [CommonModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  errorMessage: string = '';

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit() {
    this.loadVehiculos();
  }

  loadVehiculos() {
    this.errorMessage = '';
    this.vehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (error) => {
        console.error('Error al obtener vehículos:', error);
        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'No autorizado.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }
      }
    });
  }
}