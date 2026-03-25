import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

// ─── Animaciones ────────────────────────────────────────────────────────────

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

// ─── Layout principal ────────────────────────────────────────────────────────

const PageSection = styled.section`
  padding-top: 70px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const CategoryTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
`;

const TitleDivider = styled.div`
  width: 80px; height: 3px;
  background-color: #4a6163;
  border-radius: 2px;
  margin: 0.75rem auto 0;
`;

const MainCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 28px rgba(74, 97, 99, 0.12);
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Columna imagen ──────────────────────────────────────────────────────────

const ImageCol = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 500px;

  img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s ease;
  }

  &:hover img { transform: scale(1.03); }

  @media (max-width: 991px) {
    min-height: 320px;
  }
`;

const ImageBadge = styled.span`
  position: absolute; top: 18px; left: 18px;
  background: #4a6163; color: #fff;
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 20px;
  z-index: 2;
`;

const ImageOverlay = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(74,97,99,0.55) 0%, transparent 45%);
  z-index: 1;
`;

const ImageCaption = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 1.75rem 1.75rem 1.5rem;
  z-index: 2;

  h3 {
    font-family: 'Playfair Display', serif;
    color: #fff; font-size: 1.5rem;
    font-weight: 700; margin: 0 0 0.2rem;
  }
  p {
    color: rgba(255,255,255,0.82);
    font-size: 0.82rem; font-style: italic; margin: 0;
  }
`;

// ─── Columna formulario ──────────────────────────────────────────────────────

const FormCol = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #4a6163 0%, #5d7a7c 100%);
  padding: 1.75rem 2rem 1.25rem;
`;

const FormHeading = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem; font-weight: 700;
  color: #fff; margin: 0 0 0.2rem;
`;

const FormSubheading = styled.p`
  color: rgba(255,255,255,0.78);
  font-size: 0.83rem; margin: 0;
`;

// ─── Step indicator ──────────────────────────────────────────────────────────

const StepBar = styled.div`
  display: flex; align-items: center;
  margin-top: 1.25rem;
`;

const StepDot = styled.div`
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
  background: ${p => p.active ? '#fff' : p.done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.15)'};
  color: ${p => p.active ? '#4a6163' : '#fff'};
  border: 2px solid ${p => (p.active || p.done) ? '#fff' : 'rgba(255,255,255,0.3)'};
  transition: all 0.25s;
`;

const StepConnector = styled.div`
  flex: 1; height: 1.5px;
  background: ${p => p.done ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)'};
  transition: background 0.25s;
`;

const StepLabelRow = styled.div`
  display: flex; margin-top: 0.4rem;
  justify-content: space-between;
`;

const SLabel = styled.span`
  font-size: 0.62rem;
  color: ${p => p.active ? '#fff' : 'rgba(255,255,255,0.5)'};
  font-weight: ${p => p.active ? '700' : '400'};
  flex: ${p => p.grow ? 1 : 'none'};
  text-align: ${p => p.align || 'center'};
`;

// ─── Cuerpo del form ─────────────────────────────────────────────────────────

const FormBody = styled.div`
  padding: 1.75rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.25s ease;

  @media (max-width: 576px) { padding: 1.25rem 1.25rem; }
`;

const StepQuestion = styled.p`
  font-size: 0.9rem; color: #555;
  margin-bottom: 1.1rem; line-height: 1.5;
`;

// ─── Options ─────────────────────────────────────────────────────────────────

const OptionBtn = styled.button`
  width: 100%;
  background: ${p => p.sel ? '#4a6163' : '#fff'};
  border: 1.5px solid ${p => p.sel ? '#4a6163' : 'rgba(74,97,99,0.18)'};
  border-radius: 10px;
  padding: 0.75rem 1rem;
  text-align: left; cursor: pointer;
  transition: all 0.18s;
  display: flex; align-items: center; gap: 0.65rem;
  color: ${p => p.sel ? '#fff' : '#333'};
  font-size: 0.88rem;
  font-weight: ${p => p.sel ? '600' : '400'};

  &:hover { border-color: #4a6163; background: ${p => p.sel ? '#4a6163' : 'rgba(74,97,99,0.04)'}; }
  i { color: ${p => p.sel ? '#fff' : '#4a6163'}; font-size: 1rem; }
`;

const ColorBtn = styled.button`
  width: 100%;
  background: #fff;
  border: 1.5px solid ${p => p.sel ? '#4a6163' : 'rgba(74,97,99,0.18)'};
  border-radius: 10px;
  padding: 0.65rem 0.9rem;
  cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; gap: 0.65rem;
  font-size: 0.88rem;
  font-weight: ${p => p.sel ? '600' : '400'};
  color: ${p => p.sel ? '#4a6163' : '#444'};
  &:hover { border-color: #4a6163; }
`;

const Swatch = styled.div`
  width: 22px; height: 22px; border-radius: 50%;
  background: ${p => p.c}; border: 1.5px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
`;

// ─── Slider ──────────────────────────────────────────────────────────────────

const SizeNum = styled.div`
  text-align: center; margin-bottom: 1rem;
  .n { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 700; color: #4a6163; line-height: 1; }
  .u { font-size: 0.85rem; color: #999; margin-top: 0.2rem; }
`;

const RangeInput = styled.input`
  width: 100%; accent-color: #4a6163; cursor: pointer;
`;

const RangeLabels = styled.div`
  display: flex; justify-content: space-between;
  font-size: 0.75rem; color: #aaa; margin-top: 0.35rem;
`;

// ─── Resumen planta ──────────────────────────────────────────────────────────

const PlantTag = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.65rem 1rem;
  background: rgba(74,97,99,0.06);
  border: 1px solid rgba(74,97,99,0.12);
  border-radius: 8px; margin-bottom: 0.45rem;
  font-size: 0.85rem; color: #444;

  .info { display: flex; align-items: center; gap: 0.5rem; }
  .detail { font-size: 0.77rem; color: #888; }
  strong { color: #2c3e3f; }
`;

// ─── Contacto ────────────────────────────────────────────────────────────────

const ToggleRow = styled.div`
  display: flex; gap: 0.5rem; margin-bottom: 1rem;
`;

const ToggleBtn = styled.button`
  flex: 1; padding: 0.55rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.on ? '#4a6163' : 'rgba(74,97,99,0.2)'};
  background: ${p => p.on ? '#4a6163' : '#fff'};
  color: ${p => p.on ? '#fff' : '#555'};
  font-size: 0.83rem; font-weight: ${p => p.on ? '600' : '400'};
  cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 0.35rem;
`;

const TextInput = styled.input`
  width: 100%;
  border: 1.5px solid ${p => p.err ? '#dc3545' : 'rgba(74,97,99,0.2)'};
  border-radius: 10px; padding: 0.8rem 1rem;
  font-size: 0.9rem; color: #333; outline: none;
  transition: border-color 0.18s;
  &:focus { border-color: #4a6163; }
  &::placeholder { color: #c0c0c0; }
`;

const ErrMsg = styled.p`
  color: #dc3545; font-size: 0.8rem; margin: 0.4rem 0 0;
`;

// ─── Navegación ──────────────────────────────────────────────────────────────

const NavRow = styled.div`
  display: flex; align-items: center;
  justify-content: space-between;
  margin-top: auto; padding-top: 1.25rem;
  gap: 0.75rem; flex-wrap: wrap;
`;

const BtnPrimary = styled.button`
  background: #4a6163; color: #fff;
  border: none; border-radius: 50px;
  padding: 0.65rem 1.6rem;
  font-weight: 600; font-size: 0.88rem;
  cursor: pointer; transition: all 0.25s;
  display: flex; align-items: center; gap: 0.4rem;
  &:hover { background: #5d7a7c; transform: translateY(-2px); box-shadow: 0 5px 14px rgba(74,97,99,0.25); }
  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
`;

const BtnOutline = styled.button`
  background: transparent; color: #4a6163;
  border: 1.5px solid #4a6163; border-radius: 50px;
  padding: 0.65rem 1.4rem;
  font-weight: 600; font-size: 0.88rem;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 0.4rem;
  &:hover { background: rgba(74,97,99,0.05); }
`;

const BtnGhost = styled.button`
  background: transparent; color: #888;
  border: none; font-size: 0.85rem;
  cursor: pointer; padding: 0;
  display: flex; align-items: center; gap: 0.3rem;
  &:hover { color: #4a6163; }
`;

// ─── Éxito ───────────────────────────────────────────────────────────────────

const SuccessWrap = styled.div`
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 2.5rem 1.5rem;
  animation: ${fadeIn} 0.3s ease;

  .icon { font-size: 2.8rem; color: #4a6163; margin-bottom: 1rem; }
  h4 { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: #2c3e3f; margin-bottom: 0.65rem; }
  p { color: #666; font-size: 0.88rem; line-height: 1.7; max-width: 320px; }
`;

// ─── Datos ───────────────────────────────────────────────────────────────────

const PLANT_TYPES = [
  { id: 'bonsai',      label: 'Bonsai',      icon: 'bi-tree',      min: 4, max: 6 },
  { id: 'platanera',   label: 'Platanera',   icon: 'bi-tree-fill', min: 6, max: 10 },
  { id: 'ficus',       label: 'Ficus',       icon: 'bi-tree',      min: 6, max: 10 },
  { id: 'olivo',       label: 'Olivo',       icon: 'bi-tree-fill', min: 6, max: 10 },
  { id: 'black-olivo', label: 'Black Olivo', icon: 'bi-tree',      min: 6, max: 10 },
];

const MACETAS = [
  { id: 'blanca',        label: 'Blanca',        c: '#FFFFFF' },
  { id: 'negra',         label: 'Negra',         c: '#1a1a1a' },
  { id: 'gris',          label: 'Gris',          c: '#9E9E9E' },
  { id: 'terracota',     label: 'Terracota',     c: '#C1654A' },
  { id: 'natural-beige', label: 'Natural Beige', c: '#D4B896' },
];

const STEPS = ['Contacto', 'Planta', 'Maceta', 'Tamaño', 'Foto'];

const getApi = () => 'https://landing-page-1-77xa.onrender.com/api';

// ─── Página ──────────────────────────────────────────────────────────────────

const ProductosPage = () => {
  const [step, setStep]               = useState(0);
  const [cType, setCType]             = useState('email');
  const [cValue, setCValue]           = useState('');
  const [cErr, setCErr]               = useState('');
  const [zip, setZip]                 = useState('');
  const [zipErr, setZipErr]           = useState('');
  const [tipo, setTipo]               = useState('');
  const [maceta, setMaceta]           = useState('');
  const [tamano, setTamano]           = useState(6);
  const [list, setList]               = useState([]);
  const [photo, setPhoto]             = useState(null); // { data, name, type }
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState(false);

  const pt   = PLANT_TYPES.find(p => p.id === tipo);
  const mac  = MACETAS.find(m => m.id === maceta);
  const minS = pt ? pt.min : 6;
  const maxS = pt ? pt.max : 10;

  const pickTipo = id => {
    setTipo(id);
    const p = PLANT_TYPES.find(x => x.id === id);
    if (tamano < p.min) setTamano(p.min);
    if (tamano > p.max) setTamano(p.max);
  };

  const validateContact = () => {
    let valid = true;
    if (!cValue.trim()) { setCErr('Campo obligatorio'); valid = false; }
    else if (cType === 'email' && !/\S+@\S+\.\S+/.test(cValue)) { setCErr('Email inválido'); valid = false; }
    else setCErr('');
    if (!zip.trim()) { setZipErr('Campo obligatorio'); valid = false; }
    else if (!/^\d{4,10}$/.test(zip.trim())) { setZipErr('Código postal inválido'); valid = false; }
    else setZipErr('');
    return valid;
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setPhoto({ data: compressed, name: file.name.replace(/\.\w+$/, '.jpg'), type: 'image/jpeg' });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const next = () => {
    if (step === 0 && !validateContact()) return;
    setStep(s => s + 1);
  };

  const addPlant = () => {
    setList(prev => [...prev, { tipo: pt.label, maceta: mac.label, tamano }]);
    setTipo(''); setMaceta(''); setTamano(6);
    setStep(1);
  };

  const goToPhoto = () => {
    setList(prev => [...prev, { tipo: pt.label, maceta: mac.label, tamano }]);
    setStep(4);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        contact: cValue,
        contactType: cType,
        zip,
        plants: list,
        ...(photo && { photo: { data: photo.data, name: photo.name, type: photo.type } })
      };
      await axios.post(`${getApi()}/plant-quote`, payload);
    }
    catch (e) { console.error(e); }
    finally { setLoading(false); setDone(true); }
  };

  const reset = () => {
    setStep(0); setCType('email'); setCValue(''); setCErr('');
    setZip(''); setZipErr('');
    setTipo(''); setMaceta(''); setTamano(6);
    setList([]); setPhoto(null); setDone(false);
  };

  return (
    <PageSection>
      <Container className="py-5">

        <div className="text-center mb-4">
          <CategoryTitle>Plantas Faux</CategoryTitle>
          <TitleDivider />
        </div>

        <MainCard>
          {/* ── Imagen ── */}
          <ImageCol>
            <img src="/images/planta.png" alt="Planta Faux Tropical" />
            <ImageBadge>Disponible</ImageBadge>
            <ImageOverlay />
            <ImageCaption>
              <h3>Planta Faux Tropical</h3>
              <p>Decoración interior sin mantenimiento</p>
            </ImageCaption>
          </ImageCol>

          {/* ── Formulario ── */}
          <FormCol>
            <FormHeader>
              <FormHeading>Personaliza tu pedido</FormHeading>
              <FormSubheading>Configura tu planta en 5 pasos y solicita precio</FormSubheading>

              {!done && (
                <>
                  <StepBar>
                  {STEPS.map((_, i) => (
                    <React.Fragment key={i}>
                      <StepDot
                        active={step === i}
                        done={step > i}
                        onClick={() => step > i && setStep(i)}
                        style={{ cursor: step > i ? 'pointer' : 'default' }}
                        title={step > i ? `Volver a ${STEPS[i]}` : undefined}
                      >
                        {step > i
                          ? <i className="bi bi-check" style={{ fontSize: '0.8rem' }}></i>
                          : i + 1}
                      </StepDot>
                      {i < STEPS.length - 1 && <StepConnector done={step > i} />}
                    </React.Fragment>
                  ))}
                  </StepBar>
                  <StepLabelRow>
                    {STEPS.map((l, i) => (
                      <SLabel key={i} active={step === i} grow align={i === 0 ? 'left' : i === STEPS.length - 1 ? 'right' : 'center'}>
                        {l}
                      </SLabel>
                    ))}
                  </StepLabelRow>
                </>
              )}
            </FormHeader>

            <FormBody key={step}>
              {done ? (
                <SuccessWrap>
                  <div className="icon"><i className="bi bi-check-circle-fill"></i></div>
                  <h4>¡Solicitud enviada!</h4>
                  <p>
                    Te contactaremos {cType === 'email' ? `al email ${cValue}` : `al número ${cValue}`} con
                    el precio de tu selección.
                  </p>
                  <BtnPrimary onClick={reset} style={{ marginTop: '1.5rem' }}>
                    <i className="bi bi-arrow-counterclockwise"></i> Nueva solicitud
                  </BtnPrimary>
                </SuccessWrap>
              ) : (
                <>
                  {/* Lista acumulada */}
                  {list.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4a6163', marginBottom: '0.6rem' }}>
                        En tu pedido
                      </p>
                      {list.map((p, i) => (
                        <PlantTag key={i}>
                          <div className="info">
                            <i className="bi bi-tree-fill" style={{ color: '#4a6163' }}></i>
                            <div>
                              <strong>{p.tipo}</strong>
                              <div className="detail">Maceta {p.maceta} · {p.tamano} pies</div>
                            </div>
                          </div>
                          <i className="bi bi-check-circle-fill" style={{ color: '#4a6163', fontSize: '0.9rem' }}></i>
                        </PlantTag>
                      ))}
                      <div style={{ height: '1px', background: 'rgba(74,97,99,0.1)', margin: '1rem 0' }}></div>
                    </div>
                  )}

                  {/* Step 0 — Contacto */}
                  {step === 0 && (
                    <>
                      <StepQuestion>¿Cómo prefieres recibir el precio?</StepQuestion>
                      <ToggleRow>
                        <ToggleBtn on={cType === 'email'} onClick={() => { setCType('email'); setCValue(''); setCErr(''); }}>
                          <i className="bi bi-envelope-fill"></i> Email
                        </ToggleBtn>
                        <ToggleBtn on={cType === 'phone'} onClick={() => { setCType('phone'); setCValue(''); setCErr(''); }}>
                          <i className="bi bi-telephone-fill"></i> Teléfono
                        </ToggleBtn>
                      </ToggleRow>
                      <TextInput
                        err={!!cErr}
                        type={cType === 'email' ? 'email' : 'tel'}
                        placeholder={cType === 'email' ? 'tu@email.com' : '+1 (000) 000-0000'}
                        value={cValue}
                        onChange={e => { setCValue(e.target.value); setCErr(''); }}
                      />
                      {cErr && <ErrMsg>{cErr}</ErrMsg>}

                      <div style={{ marginTop: '1rem' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#555', marginBottom: '0.4rem', display: 'block' }}>
                          Código postal <span style={{ color: '#4a6163' }}>*</span>
                        </label>
                        <TextInput
                          err={!!zipErr}
                          type="text"
                          inputMode="numeric"
                          placeholder="Ej: 33101"
                          value={zip}
                          onChange={e => { setZip(e.target.value.replace(/\D/g, '')); setZipErr(''); }}
                          maxLength={10}
                        />
                        {zipErr && <ErrMsg>{zipErr}</ErrMsg>}
                      </div>

                      <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(74,97,99,0.05)', borderRadius: '10px', borderLeft: '3px solid #4a6163' }}>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', fontWeight: '700', color: '#4a6163', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          ¿Cómo funciona?
                        </p>
                        <ul style={{ margin: 0, padding: '0 0 0 1rem', fontSize: '0.85rem', color: '#666', lineHeight: '1.8' }}>
                          <li>Elige el tipo de planta, maceta y tamaño</li>
                          <li>Puedes agregar varias plantas al mismo pedido</li>
                          <li>Te enviamos el precio por el canal que elijas</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Step 1 — Tipo */}
                  {step === 1 && (
                    <>
                      <StepQuestion>¿Qué tipo de planta te interesa?</StepQuestion>
                      <Row className="g-2">
                        {PLANT_TYPES.map(p => (
                          <Col xs={12} sm={6} key={p.id}>
                            <OptionBtn sel={tipo === p.id} onClick={() => pickTipo(p.id)}>
                              <i className={`bi ${p.icon}`}></i>{p.label}
                            </OptionBtn>
                          </Col>
                        ))}
                      </Row>
                      <div style={{ marginTop: '1.25rem', padding: '0.9rem 1.1rem', background: 'rgba(74,97,99,0.05)', borderRadius: '8px', borderLeft: '3px solid #4a6163', fontSize: '0.82rem', color: '#666', lineHeight: '1.65' }}>
                        Todas nuestras plantas son de alta calidad y lucen naturales en cualquier espacio. Selecciona la que mejor se adapte a tu estilo.
                      </div>
                    </>
                  )}

                  {/* Step 2 — Maceta */}
                  {step === 2 && (
                    <>
                      <StepQuestion>Elige el color de la maceta</StepQuestion>
                      <Row className="g-2">
                        {MACETAS.map(m => (
                          <Col xs={12} sm={6} key={m.id}>
                            <ColorBtn sel={maceta === m.id} onClick={() => setMaceta(m.id)}>
                              <Swatch c={m.c} />{m.label}
                              {maceta === m.id && <i className="bi bi-check-circle-fill ms-auto" style={{ color: '#4a6163', fontSize: '0.9rem' }}></i>}
                            </ColorBtn>
                          </Col>
                        ))}
                      </Row>
                      <div style={{ marginTop: '1.25rem', padding: '0.9rem 1.1rem', background: 'rgba(74,97,99,0.05)', borderRadius: '8px', borderLeft: '3px solid #4a6163', fontSize: '0.82rem', color: '#666', lineHeight: '1.65' }}>
                        Las macetas son de cerámica premium. Si tienes dudas sobre cuál combina mejor con tu espacio, podemos asesorarte al enviarte el precio.
                      </div>
                    </>
                  )}

                  {/* Step 3 — Tamaño */}
                  {step === 3 && (
                    <>
                      <StepQuestion>
                        ¿Qué altura necesitas?
                        {pt?.id === 'bonsai' && <span style={{ color: '#aaa', fontSize: '0.8rem' }}> (Bonsai: 4 – 6 pies)</span>}
                      </StepQuestion>
                      <SizeNum>
                        <div className="n">{tamano}</div>
                        <div className="u">pies de altura</div>
                      </SizeNum>
                      <RangeInput type="range" min={minS} max={maxS} value={tamano} onChange={e => setTamano(+e.target.value)} />
                      <RangeLabels><span>{minS} pies</span><span>{maxS} pies</span></RangeLabels>

                      <div style={{ background: 'rgba(74,97,99,0.06)', borderRadius: '8px', padding: '0.85rem 1rem', marginTop: '1rem', fontSize: '0.86rem', color: '#444' }}>
                        <strong>{pt?.label}</strong> · Maceta {mac?.label} · {tamano} pies
                      </div>

                      <div style={{ marginTop: '0.85rem', padding: '0.9rem 1.1rem', background: 'rgba(74,97,99,0.05)', borderRadius: '8px', borderLeft: '3px solid #4a6163', fontSize: '0.82rem', color: '#666', lineHeight: '1.65' }}>
                        Puedes <strong>agregar otra planta</strong> al pedido o <strong>solicitar precio</strong> directamente. Te responderemos por el canal que indicaste.
                      </div>
                    </>
                  )}

                  {/* Step 4 — Foto opcional */}
                  {step === 4 && (
                    <>
                      <StepQuestion>
                        ¿Quieres adjuntar una foto del espacio?
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}> (opcional)</span>
                      </StepQuestion>

                      <label
                        htmlFor="photo-upload"
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          justifyContent: 'center', gap: '0.6rem',
                          border: `2px dashed ${photo ? '#4a6163' : 'rgba(74,97,99,0.25)'}`,
                          borderRadius: '12px', padding: '1.5rem 1rem',
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: photo ? 'rgba(74,97,99,0.05)' : '#fff',
                          textAlign: 'center'
                        }}
                      >
                        {photo ? (
                          <>
                            <img
                              src={photo.data}
                              alt="preview"
                              style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#4a6163', fontWeight: '600' }}>
                              <i className="bi bi-check-circle-fill me-1"></i>{photo.name}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Clic para cambiar</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-camera" style={{ fontSize: '2rem', color: 'rgba(74,97,99,0.4)' }}></i>
                            <span style={{ fontSize: '0.88rem', color: '#666' }}>Clic para seleccionar foto</span>
                            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>JPG, PNG o HEIC · máx. 5MB</span>
                          </>
                        )}
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePhoto}
                        />
                      </label>

                      {photo && (
                        <button
                          onClick={() => setPhoto(null)}
                          style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.8rem', marginTop: '0.5rem', cursor: 'pointer', padding: 0 }}
                        >
                          <i className="bi bi-x-circle me-1"></i>Quitar foto
                        </button>
                      )}

                      <div style={{ marginTop: '1rem', padding: '0.9rem 1.1rem', background: 'rgba(74,97,99,0.05)', borderRadius: '8px', borderLeft: '3px solid #4a6163', fontSize: '0.82rem', color: '#666', lineHeight: '1.65' }}>
                        Una foto del espacio nos ayuda a recomendarte el tamaño y estilo ideal. Puedes omitir este paso si lo prefieres.
                      </div>
                    </>
                  )}

                  {/* Navegación */}
                  <NavRow>
                    <div>
                      {step > 0 && (
                        <BtnGhost onClick={() => setStep(s => s - 1)}>
                          <i className="bi bi-arrow-left"></i> Atrás
                        </BtnGhost>
                      )}
                    </div>

                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      {step < 3 && (
                        <BtnPrimary onClick={next} disabled={(step === 1 && !tipo) || (step === 2 && !maceta)}>
                          Continuar <i className="bi bi-arrow-right"></i>
                        </BtnPrimary>
                      )}
                      {step === 3 && (
                        <>
                          <BtnOutline onClick={addPlant}>
                            <i className="bi bi-plus-circle"></i> Agregar otra
                          </BtnOutline>
                          <BtnPrimary onClick={goToPhoto}>
                            Continuar <i className="bi bi-arrow-right"></i>
                          </BtnPrimary>
                        </>
                      )}
                      {step === 4 && (
                        <BtnPrimary onClick={submit} disabled={loading}>
                          {loading
                            ? <><span className="spinner-border spinner-border-sm"></span> Enviando...</>
                            : <><i className="bi bi-send-fill"></i> Solicitar precio</>}
                        </BtnPrimary>
                      )}
                    </div>
                  </NavRow>
                </>
              )}
            </FormBody>
          </FormCol>
        </MainCard>

      </Container>
    </PageSection>
  );
};

export default ProductosPage;
