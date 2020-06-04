import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from 'src/app/services/compra.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-compra',
  templateUrl: './update-compra.component.html',
  styleUrls: ['./update-compra.component.css']
})
export class UpdateCompraComponent implements OnInit {

  compra: any = {};
  productoAModificar: any = {};
  productosEliminados: any = [];
  productosModificadosAux: any = [];
  productoAuxiliar: any = {};
  nombreAlmacen: any = '';
  guardando = false;
  error = false;

  constructor(private route: ActivatedRoute, private router: Router, private compraService: CompraService,
    private productoService: ProductoService, private almacenService: AlmacenService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.error = false;
    this.route.params.subscribe(params => {
      this.compraService.get(params['id']).subscribe(data => {
        this.compra = data[0];
        this.almacenService.get(this.compra.almacenId).subscribe(almacen => {
          this.nombreAlmacen = almacen[0].name;
        }, err => {
          this.error = true;
        })
        this.compra.itemCompra.forEach(prodCompra => {
          this.productoService.get(prodCompra.productoid).subscribe(prod => {
            prodCompra.nombre = prod[0].nombre;
            prodCompra.marca = prod[0].marca;
            prodCompra.modelo = prod[0].modelo;
            prodCompra.estado = prod[0].estado;
            prodCompra.eliminado = false;
            prodCompra.modificado = false;
          }, err => {
            this.error = true;
          });
        });


      }, err => {
        this.error = true;
      });
    }, err => {
      this.error = true;
    });
  }


  verProducto(producto, idx) {
    this.productoAuxiliar = {
      indice: idx,
      productoid: producto.productoid,
      precioUnitario: producto.precioUnitario,
      cantidad: producto.cantidad
    };
    const i = this.productosModificadosAux.filter(prod => (producto.productoid == prod.productoid));
    if (i.length === 0) {
      this.productosModificadosAux.push(this.productoAuxiliar);
    }
    this.productoAModificar = {
      estado: producto.estado,
      productoid: producto.productoid,
      nombre: producto.nombre,
      marca: producto.marca,
      modelo: producto.modelo,
      precioUnitario: producto.precioUnitario,
      cantidad: producto.cantidad,
      idxVec: idx
    };
  }

  actualizarProducto() {
    const indice = this.productoAModificar.idxVec;
    this.compra.itemCompra[indice].precioUnitario = this.productoAModificar.precioUnitario;
    this.compra.itemCompra[indice].cantidad = this.productoAModificar.cantidad;
    this.compra.neto = this.compra.neto - this.compra.itemCompra[indice].precioNeto;
    this.compra.itemCompra[indice].precioNeto = this.productoAModificar.precioUnitario * this.productoAModificar.cantidad;
    this.compra.neto = this.compra.neto + this.compra.itemCompra[indice].precioNeto;
    this.compra.itemCompra[indice].modificado = true;
    document.getElementById(`prod${indice}`).classList.add('modificado');

  }

  cancelarActualizarProducto(idx) {
    this.productosModificadosAux = this.productosModificadosAux.filter(prod => (this.productoAuxiliar.productoid !== prod.productoid));
  }

  eliminarProducto(producto, idx) {
    if (this.productosEliminados.length === (this.compra.itemCompra.length - 1)) {
      alert('No puede eliminar todos los productos de la compra.');
      return;
    }
    this.restablecer(idx);
    this.compra.neto = this.compra.neto - this.compra.itemCompra[idx].precioNeto;

    producto.eliminado = true;
    this.productosEliminados.push(idx);
    document.getElementById(`prod${idx}`).classList.add('eliminado');
  }

  restablecer(idx) {
    const productoAux = this.productosModificadosAux.filter(prod => prod.indice === idx);
    if (productoAux.length > 0) {
      this.compra.neto = this.compra.neto - this.compra.itemCompra[idx].precioNeto;
      this.compra.itemCompra[idx].precioUnitario = productoAux[0].precioUnitario;
      this.compra.itemCompra[idx].cantidad = productoAux[0].cantidad;
      this.compra.itemCompra[idx].precioNeto = this.productoAModificar.precioUnitario * this.productoAModificar.cantidad;
      this.compra.neto = this.compra.neto + this.compra.itemCompra[idx].precioNeto;
      const estaModificado = this.productosModificadosAux.indexOf(productoAux[0]);
      if (estaModificado > -1) {
        this.productosModificadosAux.splice(estaModificado, 1);
      }
    }
    const estaBorrado = this.productosEliminados.indexOf(idx);
    if (estaBorrado > -1) {
      this.compra.neto = this.compra.neto + this.compra.itemCompra[idx].precioNeto;
      this.productosEliminados.splice(estaBorrado, 1);
    }

    this.compra.itemCompra[idx].modificado = false;
    this.compra.itemCompra[idx].eliminado = false;
    document.getElementById(`prod${idx}`).classList.remove('modificado', 'eliminado');
  }


  actualizarCompra() {
    this.guardando = true;
    if (this.productosEliminados.length > 0) {
      this.eliminarProductos();
    } else {
      this.guardarCompra();
    }
  }

  eliminarProductos() {
    let productosEliminados = 0;
    let itemEliminar = {};
    this.productosEliminados.forEach(indice => {
      itemEliminar = {
        compraid: this.compra.id,
        productoid: this.compra.itemCompra[indice].productoid
      };

      this.compraService.deleteItem(itemEliminar).subscribe(data => {
        this.error = false;
        productosEliminados++;
        this.compra.itemCompra.splice(indice, 1);
        if (productosEliminados === this.productosEliminados.length) {
          this.guardarCompra();
        }
      }, err => {
        this.guardando = false;
        this.error = true;
      });
    });
  }

  guardarCompra() {
    this.compraService.update(this.compra).subscribe(data => {
      this.error = false;
      this.router.navigate(['/compra']);
    }, err => {
      this.guardando = false;
      this.error = true;
    });
  }

}