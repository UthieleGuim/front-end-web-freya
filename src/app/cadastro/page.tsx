'use client';
import Image from 'next/image'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

import { Dropzone } from '../components/Dropzone';

import Logo from '../assets/logo.png'
import Lampadas from '../assets/lampadas.svg'
import Baterias from '../assets/baterias.svg'
import PapeisPapelao from '../assets/papeis-papelao.svg'
import Eletronicos from '../assets/eletronicos.svg'
import Organincos from '../assets/organincos.svg'
import Oleo from '../assets/oleo.svg'
import Metal from '../assets/metal.svg'
import Plastico from '../assets/plastico.svg'
import Vidro from '../assets/vidro.svg'
import api from '@/services/api';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

export default function Create() {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [formData, setFormDate] = useState({
    material: '',
    name: '',
    email: '',
    whatsapp: '',
    zipCode: '',
    address: '',
    number: '',
    latitude: '0',
    longitude: '0'
  });

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const ufInitials = res.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if(selectedUf === '0') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
      const cityName = res.data.map(city => city.nome);
      setCities(cityName);
    });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;

    setSelectedUf(uf);
  }

  function handleSelecCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const {name , value } = event.target;

    setFormDate({ ...formData, [name]: value });
  }

  function handleSeachCep(event: ChangeEvent<HTMLInputElement>) {
    //https://cep.awesomeapi.com.br/json/05851210
    const {name , value} = event.target;

    setFormDate({ ...formData, [name]: value });
  }

  function handleSelectItems(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if(alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([ ...selectedItems, id ]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { material, name, email, whatsapp, zipCode, address, number, latitude, longitude } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const items = selectedItems;

   /* const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('zipCode', zipCode);
    data.append('address', address);
    data.append('number', number);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', latitude);
    data.append('longitude', longitude);
    data.append('items', items.join(','));
    
    if(selectedFile) {
      data.append('image', selectedFile);
    }*/

      let data = JSON.stringify({
        material,
        name,
        email,
        whatsapp,
        zipCode,
        address,
        number,
        uf,
        city,
        latitude,
        longitude,
        items,
    });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8989/freya',
        headers: { 

          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
   
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <header className="mt-12 flex justify-between items-center">
        <Image src={Logo} alt="Freya" />
        <a className="text-[#322153] font-bold decoration-none flex items-center gap-2 hover:opacity-75" href="/">
          <FiArrowLeft className="text-[#34CB79]" /> Voltar para home
        </a>
      </header>

      <form className="my-20 mx-auto p-16 max-w-[730px] bg-white rounded-lg flex flex-col" onSubmit={handleSubmit}>
        <h1 className="text-[36px]">Cadastro do ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset className="mt-16 border-0">
          <legend className="w-full flex justify-between items-center mb-10">
            <h2 className="text-[24px]">Dados</h2>
          </legend>


          <div className="flex-1 flex flex-col mb-11">
            <label htmlFor="material" className="text-[14px] mb-2">Sobre o material:</label>
            <input 
              type="text" 
              id="material"
              name="material" 
              onChange={handleInputChange}
              className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-6 text-[16px] text-[#6C6C80] placeholder:text-[#A0A0B2]  resize-none"
            />
          </div>

          <div className="flex-1 flex flex-col mb-11">
            <label htmlFor="name" className="text-[14px] mb-2">Nome da entidade</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              onChange={handleInputChange}
              className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80] placeholder:text-[#A0A0B2]"
            />
          </div>

          <div className="flex-1 flex gap-4">
            <div className="flex-1 flex flex-col mb-11">
              <label htmlFor="email" className="text-[14px] mb-2">E-mail</label>
              <input 
                type="email"
                id="email"
                name="email"
                onChange={handleInputChange}
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80] placeholder:text-[#A0A0B2]"
              />
            </div>

            <div className="flex-1 flex flex-col mb-11">
              <label htmlFor="whatsapp" className="text-[14px] mb-2">Whatsapp</label>
              <input 
                type="text"
                id="whatsapp"
                name="whatsapp"
                maxLength={11}
                minLength={11}
                onChange={handleInputChange}
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80] placeholder:text-[#A0A0B2]"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-16 border-0">
          <legend className="w-full flex justify-between items-center mb-10">
            <h2 className="text-[24px]">Endereço</h2>
          </legend>

          <input 
            type="hidden"
            id="longitude"
            name="longitude"
          />
          <input 
            type="hidden"
            id="latitude"
            name="latitude"
          />

          <div className="flex-1 flex gap-4">
            <div className="w-[140px] flex flex-col mb-11">
              <label htmlFor="" className="text-[14px] mb-2">CEP</label>
              <input 
                type="text"
                id="zipCode"
                name="zipCode"
                onChange={handleInputChange}
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80] placeholder:text-[#A0A0B2]"
              />
            </div>

            <div className="flex-1 flex flex-col mb-11">
              <label htmlFor="" className="text-[14px] mb-2">Endereço</label>
              <input 
                type="text"
                id="address"
                name="address"
                onChange={handleInputChange}
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80] placeholder:text-[#A0A0B2]"
              />
            </div>

            <div className="w-[80px] flex flex-col mb-11">
              <label htmlFor="" className="text-[14px] mb-2">Número</label>
              <input 
                type="text"
                id="number"
                name="number"
                onChange={handleInputChange}
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80]"
              />
            </div>
          </div> 

          <div className="flex-1 flex gap-4">
            <div className="flex-1 flex flex-col mb-11">
              <label htmlFor="" className="text-[14px] mb-2">Estado (UF)</label>
              <select  
                name="uf" 
                id="uf" 
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80]"
                value={selectedUf} 
                onChange={handleSelectUf}
              >
                <option value="">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))};
              </select>
            </div>

            <div className="flex-1 flex flex-col mb-11">
              <label htmlFor="" className="text-[14px] mb-2">Cidade</label>
              <select  
                name="city" 
                id="city" 
                className="flex-1 bg-[#F0F0F5] rounded-lg px-4 py-2 text-[16px] text-[#6C6C80]"
                value={selectedCity}
                onChange={handleSelecCity}
              >
                <option value="">Selecione uma Cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))};
              </select>
            </div>
          </div> 
        </fieldset>

        <fieldset className="mt-16 border-0">
          <legend className="w-full flex justify-between items-center mb-10">
            <h2 className="text-[24px]">Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="grid grid-cols-3 gap-4 list-none">
            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(1) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(1)}
            >
              <Image src={Lampadas} alt="Lampadas" />
              <span>Lâmpadas</span>
            </li>
            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(2) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(2)}
            >
              <Image src={Baterias} alt="Pilhas e Baterias" />
              <span>Pilhas e Baterias</span>
            </li>
            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(3) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(3)}
            >
              <Image src={PapeisPapelao} alt="Papéis e Papelão" />
              <span>Papéis e Papelão</span>
            </li>
            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(4) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(4)}
            >
              <Image src={Eletronicos} alt="Resíduos Eletrônicos" />
              <span>Resíduos Eletrônicos</span>
            </li>
            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(5) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(5)}
            >
              <Image src={Organincos} alt="Resíduos Orgânicos" />
              <span>Resíduos Orgânicos</span>
            </li>
            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(6) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(6)}
            >
              <Image src={Oleo} alt="Óleo de Cozinha" />
              <span>Óleo de Cozinha</span>
            </li>

            <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(7) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(7)}
            >
              <Image src={Metal} alt="Metal" />
              <span>Metal</span>
            </li> 

             <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(8) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(8)}
            >
              <Image src={Plastico} alt="Plástico" />
              <span>Plástico</span>
            </li>

             <li 
              className={`h-[180px] flex flex-col justify-between items-center gap-3 cursor-pointer border-1 ${selectedItems.includes(9) ? 'border-[#34CB79] bg-[#E1FAEC]' : 'border-[#f5f5f5] bg-[#f5f5f5]'} rounded-lg py-8 px-6 text-[15px] text-center font-bold`}
              onClick={() => handleSelectItems(9)}
            >
              <Image src={Vidro} alt="Vidro" />
              <span>Vidro</span>
            </li>  


          </ul>
        </fieldset>

        <button type="submit" className="w-[260px] h-[56px] bg-[#34CB79] rounded-lg text-white font-bold text-[16px] border-0 self-end mt-10 transition-all cursor-pointer hover:bg-[#2FB86E]">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
}
