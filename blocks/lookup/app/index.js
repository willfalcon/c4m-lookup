import { render, h } from 'preact';
import Block from './Block';
import './main.css';

export async function initLookup(block) {
  const admin = block.classList.contains('admin-caps');
  render(<Block admin={admin} />, block);
}
