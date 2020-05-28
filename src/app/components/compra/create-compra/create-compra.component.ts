import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { CompraService } from 'src/app/services/compra.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.css']
})
export class CreateCompraComponent implements OnInit {
  listaAlmacenes: any = [];
  productosCompra: any = [];
  productoCompra: any = {};
  productosNuevos: any = [];
  productoNuevo: any = {};
  productosAgrgadosCompleto: any = [];
  productoBuscado: any = {
    estado: null
  };
  compra: any = {
    neto: 0
  };
  esProductoNuevo = false;
  activarCamposCompra = false;
  productosNuevosGuardados = 0;
  cantidad = 0;
  infoProducCompleta = true;
  infoCompraCompleta = true;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private productoService: ProductoService, 
    private compraService: CompraService, private almacenService: AlmacenService) { }

  ngOnInit(): void {
    this.compra.userid = this.tokenStorageService.getUser().id;
    this.almacenService.getAll().subscribe(data => {
      this.listaAlmacenes = data;
    });
  }

  buscarProducto(referencia: string, estado: string) {
    let referenciaAux: string;
    this.limbiarCampos();
    if (estado === 'nuevo') {
      referenciaAux = this.productoService.codificarReferencia(referencia, 'usado');
    } else {
      referenciaAux = this.productoService.codificarReferencia(referencia, 'nuevo');
    }
    referencia = this.productoService.codificarReferencia(referencia, estado);

    this.productoService.get(referencia).subscribe(producto => {
      if (producto.length > 0) {
        this.productoBuscado = producto[0];
      } else {
        this.productoService.get(referenciaAux).subscribe(productoAux => {
          if (productoAux.length > 0) {
            this.productoBuscado.nombre = productoAux[0].nombre;
            this.productoBuscado.marca = productoAux[0].marca;
            this.productoBuscado.modelo = productoAux[0].modelo;
          }
          this.esProductoNuevo = true;
        });
      }
      this.productoBuscado.referencia = this.productoService.decodificarReferencia(referencia).referencia;
      this.productoBuscado.estado = estado;
      this.activarCamposCompra = true;
    });
  }

  verificarCampos() {
    if (this.productoBuscado.nombre != '' && this.productoBuscado.marca != '' && this.productoBuscado.modelo != '') {
      this.infoProducCompleta = true;
    } else {
      this.infoProducCompleta = false;
    }
    console.log(this.productoBuscado.precioUnitario);
  }

  agregarProducto() {
    this.productoBuscado.cantidadDisponible = this.cantidad;
    // const productoBuscadoAux = this.productoBuscado;
    // productoBuscadoAux.referencia = this.productoService.codificarReferencia(productoBuscadoAux.referencia, this.productoBuscado.estado);
    this.eliminarProducto(this.productoBuscado);

    if (this.esProductoNuevo) {
      this.productoNuevo = {
        referencia: this.productoService.codificarReferencia(this.productoBuscado.referencia, this.productoBuscado.estado),
        nombre: this.productoBuscado.nombre,
        marca: this.productoBuscado.marca,
        modelo: this.productoBuscado.modelo,
        estado: this.productoBuscado.estado,
        cantidadDisponible: this.productoBuscado.cantidadDisponible,
        precioVenta: this.productoBuscado.precioVenta,
      };
      this.productosNuevos.push(this.productoNuevo);
    }
    this.productosAgrgadosCompleto.push(this.productoBuscado);
    this.productoCompra = {
      productoid: this.productoService.codificarReferencia(this.productoBuscado.referencia, this.productoBuscado.estado),
      precioUnitario: this.productoBuscado.precioUnitario,
      cantidad: this.productoBuscado.cantidadDisponible,
      precioNeto: (this.productoBuscado.precioUnitario * this.productoBuscado.cantidadDisponible)
    };
    this.productosCompra.push(this.productoCompra);
    this.compra.itemCompra = this.productosCompra;
    this.compra.neto = this.compra.neto + this.productoCompra.precioNeto;

    this.limbiarCampos();
  }

  eliminarProducto(item: any) {
    this.productosAgrgadosCompleto = this.productosAgrgadosCompleto
      .filter(producto => ((producto.referencia != item.referencia) || (producto.estado != item.estado)));
    const ref = this.productoService.codificarReferencia(item.referencia, item.estado);
    const productoCompraEliminar = this.productosCompra.filter(producto => producto.productoid == ref);
    this.compra.neto = this.compra.neto - (productoCompraEliminar.length > 0 ? productoCompraEliminar[0].precioNeto : 0);
    this.productosCompra = this.productosCompra.filter(producto => producto.productoid != ref);
    this.productosNuevos = this.productosNuevos.filter(producto => producto.referencia != ref);

  }

  guardarCompra() {
    this.compra.fecha = this.obtenerFecha();

    if (this.productosNuevos.length > 0) {
      this.productosNuevos.forEach(producto => {
        this.productoService.create(producto).subscribe(data => {
          this.productosNuevosGuardados++;
          if (this.productosNuevosGuardados === this.productosNuevos.length) {
            this.compraService.create(this.compra).subscribe(data => {
              this.productosNuevosGuardados = 0;
              this.router.navigate(['/compra']);
            });
          }
        });
      });
    } else {
      this.compraService.create(this.compra).subscribe(data => {
        this.router.navigate(['/compra']);
      });
    }
  }

  obtenerFecha() {
    const fecha = new Date();
    const dd = fecha.getDate();
    const mm = fecha.getMonth() + 1;
    const yyyy = fecha.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }

  limbiarCampos() {
    this.productoBuscado = {
      estado: null
    };
    this.cantidad = 0;
    this.esProductoNuevo = false;
    this.activarCamposCompra = false;
  }



}
