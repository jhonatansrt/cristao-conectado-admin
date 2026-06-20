import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { namedRoutes } from '../../named-routes';

@Component({
  selector: 'app-landing',
  imports: [MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  private readonly router = inject(Router);

  public goToLogin(): void {
    void this.router.navigate([namedRoutes.login]);
  }

  public readonly features = [
    {
      icon: 'calendar_month',
      title: 'Agenda',
      description: 'Gerencie eventos e compromissos da sua igreja com um calendário completo e intuitivo.',
    },
    {
      icon: 'assignment_ind',
      title: 'Escala de Serviço',
      description: 'Organize e distribua as escalas de voluntários e servidores de forma prática.',
    },
    {
      icon: 'group',
      title: 'Membros',
      description: 'Cadastre e acompanhe todos os membros da sua comunidade em um só lugar.',
    },
    {
      icon: 'queue_music',
      title: 'Playlists & Vídeos',
      description: 'Crie playlists de louvor e gerencie vídeos para os cultos e reuniões.',
    },
    {
      icon: 'campaign',
      title: 'Avisos',
      description: 'Publique e compartilhe avisos importantes com toda a congregação.',
    },
    {
      icon: 'volunteer_activism',
      title: 'Pedidos de Oração',
      description: 'Receba e interceda pelos pedidos de oração dos membros da sua Igreja.',
    },
    {
      icon: 'record_voice_over',
      title: 'Testemunhos',
      description: 'Registre e celebre os testemunhos e milagres da sua comunidade.',
    },
    {
      icon: 'workspace_premium',
      title: 'Cargos',
      description: 'Defina e gerencie os cargos e funções dentro da estrutura da sua Igreja.',
    },
    {
      icon: 'how_to_reg',
      title: 'Solicitações',
      description: 'Aprove ou recuse solicitações de entrada de novos membros na sua Igreja.',
    },
  ];
}
