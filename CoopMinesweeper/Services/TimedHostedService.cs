using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CoopMinesweeper.Services
{
    public class TimedHostedService : IHostedService, IDisposable
    {
        private Timer _timer;

        private readonly IGameService _gameService;

        public TimedHostedService(IGameService gameService)
        {
            _gameService = gameService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            _gameService.RemoveOldGames();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
