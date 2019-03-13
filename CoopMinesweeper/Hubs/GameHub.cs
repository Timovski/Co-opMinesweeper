using CoopMinesweeper.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CoopMinesweeper.Hubs
{
    public class GameHub : Hub<IGameClient>
    {
        private readonly IGameService _gameService;

        public GameHub(IGameService gameService)
        {
            _gameService = gameService;
        }

        public string CreateGame()
        {
            var gameId = _gameService.CreateGame(Context.ConnectionId);
            return gameId;
        }

        public void GetHostSignal(string gameId)
        {
            var hostConnectionId = _gameService.GetHostConnectionId(gameId);
            if (string.IsNullOrWhiteSpace(hostConnectionId))
                return;
            
            Clients.Client(hostConnectionId).HostSignalPrompt(Context.ConnectionId);
        }

        public void ReceiveHostSignal(string clientConnectionId, string hostSignal)
        {
            Clients.Client(clientConnectionId).ClientSignalPrompt(Context.ConnectionId, hostSignal);
        }

        public void ReceiveClientSignal(string hostConnectionId, string clientSignal)
        {
            Clients.Client(hostConnectionId).ConnectWithClient(clientSignal);
        }
    }

    public interface IGameClient
    {
        Task HostSignalPrompt(string clientConnectionId);
        Task ClientSignalPrompt(string hostConnectionId, string hostSignal);
        Task ConnectWithClient(string clientSignal);
    }
}
