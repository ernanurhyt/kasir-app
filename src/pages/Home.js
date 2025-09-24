import logo from '../logo.svg';
import '../App.css';
import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { ComLeftBar, ComRightBar, Menus } from '../components/Index'
import { API_URL } from '../utils/constants'
import axios from 'axios'
import Swal from 'sweetalert2';

// IMPORT GAMBAR LOKAL
import nasiGoreng from '../assets/images/nasi-goreng.jpg';
import mieGoreng from '../assets/images/mie-goreng.jpg';
import esTeh from '../assets/images/es-teh.jpg';
import kopiHitam from '../assets/images/kopi-hitam.jpg';
import keripikKentang from '../assets/images/keripik-kentang.jpg';

// MOCK DATA UNTUK TESTING
const mockProducts = [
  {
    id: 1,
    nama: "Nasi Goreng",
    harga: 25000,
    category: { nama: "Makanan" },
    gambar: nasiGoreng, //gambar: "https://via.placeholder.com/150",
    deskripsi: "Nasi goreng spesial dengan telur dan ayam"
  },
  {
    id: 2,
    nama: "Mie Goreng",
    harga: 20000,
    category: { nama: "Makanan" },
    gambar: mieGoreng, //gambar: "https://via.placeholder.com/150",
    deskripsi: "Mie goreng dengan sayuran segar"
  },
  {
    id: 3,
    nama: "Es Teh Manis",
    harga: 8000,
    category: { nama: "Minuman" },
    gambar: esTeh, //gambar: "https://via.placeholder.com/150",
    deskripsi: "Es teh manis segar"
  },
  {
    id: 4,
    nama: "Kopi Hitam",
    harga: 12000,
    category: { nama: "Minuman" },
    gambar: kopiHitam, //gambar: "https://via.placeholder.com/150",
    deskripsi: "Kopi hitam original"
  },
  {
    id: 5,
    nama: "Keripik Kentang",
    harga: 15000,
    category: { nama: "Cemilan" },
    gambar: keripikKentang, //gambar: "https://via.placeholder.com/150",
    deskripsi: "Keripik kentang renyah"
  }
];

const mockKeranjangs = [
  {
    id: 1,
    jumlah: 2,
    total_harga: 50000,
    product: {
      id: 1,
      nama: "Nasi Goreng",
      harga: 25000,
      gambar: "https://via.placeholder.com/150"
    }
  }
];

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menus: [],
      categoryYangDipilih: 'Makanan',
      keranjangs: [],
    }
  }

  componentDidMount() {
    this.getProductsByCategory(this.state.categoryYangDipilih);
    this.getListKeranjang();
  }

  getProductsByCategory = (category) => {
    axios
      .get(API_URL + "products?category.nama=" + category)
      .then(res => {
        console.log("Response dari API: ", res.data);
        const menus = res.data;
        this.setState({ menus: menus });
      })
      .catch(error => {
        console.log("Error dari API, menggunakan mock data");
        // FILTER MOCK DATA BERDASARKAN KATEGORI
        const filteredMenus = mockProducts.filter(menu => 
          menu.category.nama === category
        );
        this.setState({ menus: filteredMenus });
      });
  }

  getListKeranjang = () => {
    axios
      .get(API_URL + "keranjangs")
      .then(res => {
        console.log("Keranjang dari API: ", res.data);
        const keranjangs = res.data;
        this.setState({ keranjangs: keranjangs });
      })
      .catch(error => {
        console.log("Error dari API keranjang, menggunakan mock data");
        // this.setState({ keranjangs: mockKeranjangs });
      });
  }

  changeCategory = (value) => {
    this.setState({
      categoryYangDipilih: value,
      menus: [] // Kosongkan dulu untuk loading effect
    });
    
    this.getProductsByCategory(value);
  }

  masukKeranjang = (value) => {
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then(res => {
        if (res.data.length === 0) {
          const keranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value
          };
          
          axios
            .post(API_URL + "keranjangs", keranjang)
            .then(res => {
              this.getListKeranjang()
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: keranjang.product.nama + ' Sukses Masuk Keranjang',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch(error => {
              console.log("Error post keranjang, simulasi success");
              // SIMULASI SUKSES TAMBAH KERANJANG
              const newKeranjang = {
                id: Date.now(),
                jumlah: 1,
                total_harga: value.harga,
                product: value
              };
              this.setState(prevState => ({
                keranjangs: [...prevState.keranjangs, newKeranjang]
              }));
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: value.nama + ' Sukses Masuk Keranjang (Mock)',
                showConfirmButton: false,
                timer: 1500
              })
            });

        } else {
          const keranjang = {
            jumlah: res.data[0].jumlah + 1,
            total_harga: res.data[0].total_harga + value.harga,
            product: value
          };
          
          axios
            .put(API_URL + "keranjangs/" + res.data[0].id, keranjang)
            .then(res => {
              this.getListKeranjang()
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: keranjang.product.nama + ' Sukses Masuk Keranjang Lagi',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch(error => {
              console.log("Error update keranjang, simulasi success");
              // SIMULASI UPDATE KERANJANG
              this.getListKeranjang();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: value.nama + ' Sukses Masuk Keranjang Lagi (Mock)',
                showConfirmButton: false,
                timer: 1500
              })
            });
        }
      })
      .catch(error => {
        console.log("Error check keranjang, simulasi keranjang kosong");
        // SIMULASI JIKA KERANJANG KOSONG
        const newKeranjang = {
          id: Date.now(),
          jumlah: 1,
          total_harga: value.harga,
          product: value
        };
        this.setState(prevState => ({
          keranjangs: [...prevState.keranjangs, newKeranjang]
        }));
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: value.nama + ' Sukses Masuk Keranjang (Mock)',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  render() {
    const { menus, categoryYangDipilih, keranjangs } = this.state
    return (
      <div className='mt-3'>
        <Container fluid>
          <Row>
            <ComLeftBar 
              changeCategory={this.changeCategory} 
              categoryYangDipilih={categoryYangDipilih} 
            />
            <Col className='mt-3'>
              <h4><strong>Daftar Produk - {categoryYangDipilih}</strong></h4>
              <hr />
              <Row className='overflow-auto menu'>
                {menus && menus.length > 0 ? (
                  menus.map((menu) => (
                    <Menus
                      key={menu.id}
                      menu={menu}
                      masukKeranjang={this.masukKeranjang}
                    />
                  ))
                ) : (
                  <div className="text-center w-100">
                    <p>Tidak ada produk untuk kategori {categoryYangDipilih}</p>
                  </div>
                )}
              </Row>
            </Col>
            <ComRightBar 
              keranjangs={keranjangs} 
              {...this.props} 
              getListKeranjang={this.getListKeranjang}
            />
          </Row>
        </Container>
      </div>
    )
  }
}