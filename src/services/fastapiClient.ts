/**
 * =============================================================================
 * SYNTHETICA FASTAPI CLIENT (Frontend em React -> Backend FastAPI)
 * =============================================================================
 * Módulo JavaScript / TypeScript para consumo da API RESTful desenvolvida em
 * FastAPI (Python), implementando comunicação assíncrona (fetch) para todos os
 * métodos HTTP obrigatórios: GET, POST, PUT e DELETE.
 *
 * Em ambiente de desenvolvimento local, aponte FASTAPI_BASE_URL para http://localhost:8000.
 * =============================================================================
 */

import { ArchiveItem } from '../types';

export const FASTAPI_BASE_URL =
  (import.meta as any).env?.VITE_FASTAPI_URL || 'http://localhost:8000';

export interface FastApiObraPayload {
  title: string;
  originalTitle?: string;
  creator: string;
  year: number;
  decade: string;
  category: string;
  coverUrl: string;
  curatorialNotes: string;
  aestheticTags?: string[];
  mediaType?: string;
  quote?: string;
}

export const fastApiClient = {
  /**
   * GET: Listar todas as obras do acervo com suporte a filtros de categoria e década
   */
  async listarObras(categoria?: string, decada?: string): Promise<ArchiveItem[]> {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'todas') params.append('categoria', categoria);
    if (decada && decada !== 'todas') params.append('decada', decada);

    const url = `${FASTAPI_BASE_URL}/api/v1/obras${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar obras no FastAPI: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * GET por ID: Obter detalhes técnicos de uma obra específica
   */
  async obterObra(id: string): Promise<ArchiveItem> {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/obras/${id}`);
    if (!response.ok) {
      throw new Error(`Obra não encontrada no FastAPI: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * POST: Cadastrar nova obra no banco em memória via FastAPI
   */
  async cadastrarObra(payload: FastApiObraPayload): Promise<ArchiveItem> {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/obras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Falha ao cadastrar obra via FastAPI: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * PUT: Atualizar dados de uma obra existente
   */
  async atualizarObra(id: string, payload: Partial<FastApiObraPayload>): Promise<ArchiveItem> {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/obras/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Falha ao atualizar obra via FastAPI: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * PATCH: Registrar curtida na obra em tempo real
   */
  async curtirObra(id: string): Promise<{ likesCount: number }> {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/obras/${id}/curtir`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Falha ao registrar curtida via FastAPI: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * DELETE: Remover uma obra do acervo
   */
  async excluirObra(id: string): Promise<{ status: string; id_removido: string }> {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/obras/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Falha ao excluir obra via FastAPI: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * POST: Checkout de assinatura digital (Digital Product & Business)
   */
  async checkoutAssinatura(dados: {
    plan: string;
    billingCycle: string;
    paymentMethod: string;
    userEmail: string;
    couponCode?: string;
  }) {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/v1/assinaturas/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!response.ok) {
      throw new Error(`Falha no checkout via FastAPI: ${response.statusText}`);
    }
    return response.json();
  },
};
