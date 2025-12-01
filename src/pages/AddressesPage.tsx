import { useEffect, useState } from 'react';
import Navigation from '../components/layout/Navigation';
import Modal from '../components/common/Modal';
import { addressService } from '../services/AddressService';
import type { Address } from '../services/AddressService';
import './AddressesPage.css';

const STORAGE_KEY = 'pk_addresses_v1';

export default function AddressesPage() {
  const LottiePlayer: any = 'lottie-player';
  const locationLottie = new URL('../assets/Location.json', import.meta.url).toString();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Address>({
    id: '',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  // Load addresses from API on mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await addressService.getAddresses();
        if (response.success && response.data) {
          setAddresses(response.data);
        } else {
          // Fallback to localStorage
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setAddresses(JSON.parse(raw));
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
        // Fallback to localStorage on error
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setAddresses(JSON.parse(raw));
        } catch {}
      }
    };

    loadAddresses();
  }, []);

  // Sync addresses to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch {}
  }, [addresses]);

  const hasAny = addresses.length > 0;

  const validate = (data: Address) => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim()) e.fullName = 'Required';
    if (!/^\+?\d{7,15}$/.test(data.phone.replace(/\s|-/g, ''))) e.phone = 'Invalid phone';
    if (!data.line1.trim()) e.line1 = 'Required';
    if (!data.city.trim()) e.city = 'Required';
    if (!data.state.trim()) e.state = 'Required';
    if (!/^[A-Za-z0-9\-\s]{3,10}$/.test(data.postalCode.trim())) e.postalCode = 'Invalid code';
    if (!data.country.trim()) e.country = 'Required';
    return e;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ id: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: !hasAny });
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({ ...a });
    setErrors({});
    setFormOpen(true);
  };

  const cancelForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    
    setSaving(true);
    try {
      if (editing) {
        // Update existing address
        const response = await addressService.updateAddress(editing.id, {
          fullName: form.fullName,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          isDefault: form.isDefault,
        });

        if (response.success && response.data) {
          setAddresses(prev => prev.map(a => (a.id === editing.id ? response.data! : a)));
        } else {
          throw new Error(response.error || 'Failed to update address');
        }
      } else {
        // Create new address
        const response = await addressService.createAddress({
          fullName: form.fullName,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          isDefault: form.isDefault,
        });

        if (response.success && response.data) {
          setAddresses(prev => {
            let next = [...prev, response.data!];
            if (response.data!.isDefault) {
              next = next.map(a => ({ ...a, isDefault: a.id === response.data!.id }));
            }
            return next;
          });
        } else {
          throw new Error(response.error || 'Failed to create address');
        }
      }

      setFormOpen(false);
      setEditing(null);

      // If a return path is specified, navigate back to it
      try {
        const params = new URLSearchParams(window.location.search);
        const ret = params.get('return');
        if (ret) {
          window.location.href = ret;
        }
      } catch {}
    } catch (err) {
      console.error('Error saving address:', err);
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to save address' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const response = await addressService.deleteAddress(id);
      if (response.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
      } else {
        console.error('Failed to delete address:', response.error);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const makeDefault = async (id: string) => {
    try {
      const addressToUpdate = addresses.find(a => a.id === id);
      if (addressToUpdate) {
        const response = await addressService.updateAddress(id, { isDefault: true });
        if (response.success) {
          setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
        } else {
          console.error('Failed to set default address:', response.error);
        }
      }
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  return (
    <div className="addresses-page">
      <Navigation />
      <div className="addresses-container">
        <div className={`addresses-header ${hasAny ? 'addresses-header--has' : ''}`}>
          <h1 className="addresses-title">Your Addresses</h1>
          {hasAny && (
            <button className="btn btn-primary" onClick={openAdd}>Add Address</button>
          )}
        </div>

        {!hasAny && (
          <div className="addresses-empty">
            <div className="addresses-empty-banner">
              <LottiePlayer
                src={locationLottie}
                background="transparent"
                speed="1"
                style={{ width: '220px', height: '220px' }}
                loop
                autoplay
              />
              <div className="addresses-empty-content">
                <h2 className="addresses-empty-title">No address added</h2>
                <p className="addresses-empty-sub">Save your address to speed up checkout and deliveries.</p>
                <button className="btn btn-primary empty-cta" onClick={openAdd}>Add Address</button>
              </div>
            </div>
          </div>
        )}

        {hasAny && (
          <ul className="addresses-list">
            {addresses.map(a => (
              <li key={a.id} className={`address-card ${a.isDefault ? 'address-card--default' : ''}`}>
                <div className="address-card__main">
                  <div className="address-card__name">{a.fullName}</div>
                  <div className="address-card__meta">{a.phone}</div>
                  <div className="address-card__addr">
                    {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postalCode}, {a.country}
                  </div>
                </div>
                <div className="address-card__actions">
                  {!a.isDefault && (
                    <button className="btn btn-secondary" onClick={() => makeDefault(a.id)}>Make Default</button>
                  )}
                  <button className="btn" onClick={() => openEdit(a)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => remove(a.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Modal open={formOpen} title={editing ? 'Edit Address' : 'Add Address'} onClose={cancelForm}>
          <form className="address-form" onSubmit={submit}>
            <div className="form-row">
              <label>
                <span>Full Name</span>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                {errors.fullName && <em className="err">{errors.fullName}</em>}
              </label>
              <label>
                <span>Phone</span>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 99999 99999" />
                {errors.phone && <em className="err">{errors.phone}</em>}
              </label>
            </div>
            <label>
              <span>Address Line 1</span>
              <input value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
              {errors.line1 && <em className="err">{errors.line1}</em>}
            </label>
            <label>
              <span>Address Line 2 (optional)</span>
              <input value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} />
            </label>
            <div className="form-row">
              <label>
                <span>City</span>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                {errors.city && <em className="err">{errors.city}</em>}
              </label>
              <label>
                <span>State</span>
                <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                {errors.state && <em className="err">{errors.state}</em>}
              </label>
            </div>
            <div className="form-row">
              <label>
                <span>Postal Code</span>
                <input value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
                {errors.postalCode && <em className="err">{errors.postalCode}</em>}
              </label>
              <label>
                <span>Country</span>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                {errors.country && <em className="err">{errors.country}</em>}
              </label>
            </div>
            <label className="checkbox">
              <input type="checkbox" checked={!!form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
              <span>Set as default address</span>
            </label>
            <div className="form-actions">
              <button type="button" className="btn" onClick={cancelForm}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Address' : 'Save Address'}</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
