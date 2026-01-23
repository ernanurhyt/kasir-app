import logo from '../logo.svg';
import '../App.css';
import React, { Component, useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { ComLeftBar, ComRightBar, ComListOrderBar, Menus } from '../components/Index'
import axios from 'axios'
import { AuthContext } from '../authentication/AuthContext';


export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menus: [],
      categoryYangDipilih: 'Makanan',
      keranjangs: [],
    }
  }
  state = {
    showRightBar: false  // State untuk kontrol tampilan
    // ,user: null // ✅ Tambah state user
    //   ,loadingUser: true
  }

  async componentDidMount() {
    this.getProductsByCategory(this.state.categoryYangDipilih);
    this.getListKeranjang();
    // await this.getUserProfile(); // ✅ Get user data
  }

  // getUserProfile = async () => {
  //   try {
  //     const userData = await getUserData();
  //     this.setState({ 
  //       user: userData.user.username,
  //       loadingUser: false 
  //     });
  //     // alert(`Welcome, ${userData.user.username}!`);
  //   } catch (error) {
  //     console.error('Failed to get user data:', error);
  //     this.setState({ loadingUser: false });
  //   }
  // };

  getProductsByCategory = (category) => {
    const url = "https://backend-production-49fd.up.railway.app/menulist";
    axios
      .get(url) // .get('/data/db.json')// .get(API_URL + "products?category.nama=" + category)
      .then(res => {
        const allMenus = res.data; 
        this.setState({ menus: allMenus });

        // // alert( JSON.stringify(res.data.menu))
        // const allMenus = res.data.menu;
        // let filteredMenus = allMenus;
        // if (category) {
        //   filteredMenus = allMenus.filter(menu => 
        //     menu.category.nama === category
        //   );
        // }
        // this.setState({ menus: filteredMenus });
      })
      .catch(error => {
        alert("Error get data menu dari API")
      });
  }

  getListOrder = () => {
    // alert("halo getlist ijbjybhj")
    // Toggle antara true/false
    this.setState(prevState => ({
      showRightBar: !prevState.showRightBar
    }));
  }
  getNewOrder = () => {
    // alert("halo getnew order")
    this.setState(prevState => ({
      showRightBar: !prevState.showRightBar
    }));
  }

  getListKeranjang = () => {
    const keranjang = localStorage.getItem('keranjang');
    if (keranjang) {
      const dataKeranjang = JSON.parse(keranjang);
      // alert(JSON.stringify(dataKeranjang));
      this.setState({ keranjangs: dataKeranjang });
    // } else {
    //   alert('Keranjang kosong');
    }
  }

  changeCategory = (value) => {
    this.setState({
      categoryYangDipilih: value,
      menus: [] // Kosongkan dulu untuk loading effect
    });
    
    this.getProductsByCategory(value);
  }

  masukKeranjang = (value) => {
      const mykeranjang = JSON.parse(localStorage.getItem('keranjang') || '[]');
      
      // Find data true / false
      const items = mykeranjang.some(item => item.product.id === value.id);
      
      //JIKA MENU BELUM ADA DI KERANJANG
      if (items == false) { //if (items.length !== 0) {
        const keranjang = {
          jumlah: 1,
          total_harga: value.Harga,
          product: value
        };
          // Ambil data existing dari localStorage
        const existingCart = JSON.parse(localStorage.getItem('keranjang')) || [];
        
        // Tambah data baru
        existingCart.push(keranjang);
        
        // Simpan kembali ke localStorage
        localStorage.setItem('keranjang', JSON.stringify(existingCart));
      
        this.getListKeranjang();
        // alert('Data berhasil disimpan');
          
        //JIKA ADA MENU YG SUDAH MASUK KERANJANG
        } else {          
          
          //FOR ADD AGAIN
          const keranjangs = JSON.parse(localStorage.getItem('keranjang') || '[]');
          // Filter data berdasarkan product ID yang sama dengan value.id
          const filteredData = keranjangs.filter(item => item.product.MenuID === value.MenuID);
          // alert(JSON.stringify(filteredData));
          // localStorage.removeItem('keranjang');
          const keranjang = {
            // jumlah: filteredData.map(item => { item.jumlah + 1 }) ,
            // total_harga: filteredData.map(item => { item.total_harga + value.harga }) , 
            // product: value
            jumlah: filteredData.reduce((total, item) => total + item.jumlah, 0) + 1, //res.data[0].jumlah + 1,
            total_harga: filteredData.reduce((total, item) => total + item.total_harga, 0) + value.Harga, //res.data[0].total_harga + value.harga,
            product: value
          };
          
          // //DELETE EXISTING DATA
          // const mykeranjang = JSON.parse(localStorage.getItem('keranjang') || '[]');
          // const indexToDelete = mykeranjang.findIndex(item => item.product.id === value.id);
          // mykeranjang.splice(indexToDelete, 1);
          // localStorage.setItem('keranjang', JSON.stringify(mykeranjang));

          // //ADD
          // // Ambil data existing dari localStorage
          // const existingCart = JSON.parse(localStorage.getItem('keranjang')) || [];
          // // Tambah data baru
          // existingCart.push(keranjang);
          // // Simpan kembali ke localStorage
          // localStorage.setItem('keranjang', JSON.stringify(existingCart));
         
        

          const existingCart = JSON.parse(localStorage.getItem('keranjang') || '[]');
          const itemIndex = existingCart.findIndex(item => item.product.MenuID === value.MenuID);
          if (itemIndex !== -1) {
            // Update existing item
            existingCart[itemIndex] = { ...existingCart[itemIndex], ...keranjang };
          } else {
            // Add new item
            existingCart.push(keranjang);
          }

          localStorage.setItem('keranjang', JSON.stringify(existingCart));

          this.getListKeranjang();

      //HERES EDIT///////

        }
  }

  render() {
    const { menus, categoryYangDipilih, keranjangs } = this.state
    const { showRightBar } = this.state;
    // const { user, loadingUser } = this.state;
    return (
      <div className='mt-3'>
      <AuthContext.Consumer>
        {(auth) => (
          <div>
            {auth.user && (
              <div style={{ padding: '10px', background: '#f0f0f0' }}>
                {/* <h3>Welcome, {auth.user.username}!</h3> */}
                  <div className="text-end">
                    <button onClick={auth.logout}> Logout </button>
                  </div>
                  <h4 className="fw-bold">FORM ORDER</h4>
                  {auth.user.username === "customer" ? ( 
                    <Container fluid>
                      <Row >
                        {/* DISABLE SEMENTARA */}
                        {/* <ComLeftBar 
                          changeCategory={this.changeCategory} 
                          categoryYangDipilih={categoryYangDipilih} 
                        /> */}
                        <Col className='mt-3'>
                        <strong>KLIK ITEM</strong>  
                        {/* <h4            
                            size="lg"
                            style={{
                                backgroundColor: '#FFD700',
                                border: 'none',
                                color: '#523a3a',
                                fontWeight: '800',
                                fontSize: '1rem',
                                padding: '12px 28px',
                                borderRadius: '50px',
                                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                transition: 'all 0.3s ease',
                                // textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
                            (Klik item untuk masuk keranjang)
                        </h4>                     */}
                        
                          <hr />
                          <Row>  {/* <Row className='overflow-auto menu'> */}
                            {menus && menus.length > 0 ? (
                              menus.map((menu) => (
                                <Menus
                                  key={menu.MenuID}
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
                        
                        {showRightBar ? (
                          <ComListOrderBar 
                            {...this.props} 
                            getNewOrder={this.getNewOrder}           
                          />
                        ) : (
                          <ComRightBar 
                            keranjangs={keranjangs} 
                            {...this.props} 
                            getListKeranjang={this.getListKeranjang}
                            getListOrder={this.getListOrder}
                          /> 
                        )}

                      </Row>
                    </Container>

                  ) : auth.user.username === "cashier" ? ( 
                    <ComListOrderBar 
                      {...this.props} 
                      getNewOrder={this.getNewOrder}           
                    />
                  ) :
                  <p></p>
                  } 

              </div>
            )}
          </div>
        )}
      </AuthContext.Consumer>
    </div>
    )
  }
}